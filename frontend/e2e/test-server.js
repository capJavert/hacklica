const jsonServer = require('json-server');
const server = jsonServer.create();
const path = require('path');
const router = jsonServer.router(path.join(__dirname, 'test-db.json'));
const middlewares = jsonServer.defaults();

// define primary key columns for each resource
const primaryKeys = {};

const port = 3200;

server.use(middlewares);
server.use(router);
server.listen(port, () => {
  console.log('Test server is running on port: ' + port)
});

router.render = (req, res) => {
  const resource = req.path.split('/')[1];
  let filteredResponse = res.locals.data;

  // remapping internal id columns to dedicated resource columns
  if (req.method === 'POST' || req.method === 'PUT') {
    req.body.id = req.body[primaryKeys[resource]];
  } else if (req.method === 'GET') {
    filteredResponse = filterResponse(resource, res.locals.data);
  }

  // optional response wrapping to data attribute
  res.jsonp({
    data: filteredResponse
  });
};

function filterResponse(resource, response) {
  // don't filter if primaryKey is same as internal
  if (primaryKeys[resource] === 'id') {
    return response;
  }

  if (response instanceof Array) {
    for (let i=0;i<response.length;i++) {
      delete response[i].id;
    }
  } else {
    delete response.id;
  }

  return response;
}
