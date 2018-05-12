const puppeteer = require('puppeteer');
const profile = require('./devices.profiles');

(async () => {
    const browser = await puppeteer.launch({headless: false, timeout: 100000});

    try {
        const page = await browser.newPage();
        await page.emulate(profile.desktop);
        await page.goto('https://www.google.hr/', {waitUntil: 'networkidle'});

        await page.waitFor(100);

        await page.focus('input#lst-ib');
        await page.type('did you watch th');

        await page.waitFor(200);

        await page.waitForSelector('ul.sbsb_b');

        console.log(await page.$eval('ul.sbsb_b > li:first-child', (element) => {
            return element.innerText.trim();
        }));

        await page.waitFor(10000);
    } catch (e) {
        console.log(e);
    }

    await browser.close();
})();

async function setSelectVal(page, sel, val) {
    page.evaluate((data) => {
        return document.querySelector(data.sel).value = data.val
    }, {sel, val})
}

