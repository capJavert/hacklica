const puppeteer = require('puppeteer');
const profile = require('./devices.profiles');
const {google} = require('googleapis');

const appRouter = function (app) {
    puppeteer.launch({headless: true, timeout: 0, args: ['--no-sandbox', '--disable-setuid-sandbox']}).then(async browser => {
        const page = await browser.newPage();
        page.emulate(profile.desktop);

        app.get("/get-search", async function(request, response) {
            return response.send(await (async () => {
                try {
                    await page.goto('https://www.google.hr/');

                    await page.waitForSelector('input#lst-ib');

                    console.log(request.query.term);

                    await page.focus('input#lst-ib');
                    await page.type(request.query.term);

                    await page.waitFor(200);

                    await page.waitForSelector('ul.sbsb_b');

                    const search = await page.$eval('ul.sbsb_b > li:first-child', (element) => {
                        return element.innerText.trim();
                    });

                    console.log({search: search});

                    return JSON.stringify({search: search});
                } catch (e) {
                    console.log(e);

                    return JSON.stringify({error: e.toString()})
                }
            })());
        });

        function getAccessToken() {
            return new Promise(function(resolve, reject) {
                let key = require('./snack-4fb7f5f83233');
                let jwtClient = new google.auth.JWT(
                    key.client_email,
                    null,
                    key.private_key,
                    "https://www.googleapis.com/auth/firebase.messaging",
                    null
                );
                jwtClient.authorize(function(err, tokens) {
                    if (err) {
                        console.log(err);
                        reject(err);
                        return;
                    }
                    resolve(tokens.access_token);
                });
            });
        }

        app.get("/bearer-auth", async function(request, response) {
            return response.send(await (async () => {
                return JSON.stringify({"bearer": await getAccessToken()});
            })());
        });
    });
};

module.exports = appRouter;