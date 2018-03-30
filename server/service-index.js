// require('newrelic');
const express = require('express');
// const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length; // 4

// server side react
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const Gallery = require('./server-bundle.js');

const dbHost = process.env.DATABASE_HOST || 'localhost';
const port = process.env.PORT || 3001;

async function queryDb(req, collection) {
  let { id } = req.params || 9873;
  id = Number(id);
  const result = await collection.findOne({ place_id: id });
  return result;
}

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork({ workerID: i + 1 });
  }
} else {
  const app = express();
  
  app.get('/', (req, res) => {
    res.status(302).redirect('/restaurants/75');
  });

  app.use(cors());
  // app.use(bodyParser.json());
  app.use('/', express.static(path.join(__dirname, '../client/dist')));
  
  MongoClient.connect(`mongodb://${dbHost}/`, (err, client) => {
    if (err) {
      throw err;
    } else {
      const db = client.db('gallery');
      const collection = db.collection('photos');
      app.get('/restaurants/:id', async (req, res) => {
        const json = await queryDb(req, collection);
        const component = ReactDOMServer.renderToString(React.createElement(Gallery.App, { data: json }));
        const html = `
                <div id="gallery">${component}</div>
                <script>
                  window.galleryData = ${JSON.stringify(json)};
                </script>
          `;

        res.send(html);
      });
    }
  });
    
  app.listen(port, () => console.log(`Gallery App listening on port ${port}!\nbtw you're looking dapper today...`));
}

