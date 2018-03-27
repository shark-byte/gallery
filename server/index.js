// require('newrelic');
const express = require('express');
// const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
// const cors = require('cors');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length; // 4

// const dbHost = process.env.DATABASE_HOST || 'database'; //for docker
const dbHost = 'localhost';

const port = 3001;

async function queryDb(id, collection) {
  const num = Number(id);
  const info = await collection.findOne({ place_id: num });
  return info;
}

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  const app = express();
  
  // app.use(cors());
  // app.use(bodyParser.json());
  app.use('/restaurants/:id', express.static(path.join(__dirname, '../client/dist')));
  
  app.get('/', (req, res) => {
    res.status(302).redirect('/restaurants/5');
  });


  MongoClient.connect(`mongodb://${dbHost}/`, (err, client) => {
    if (err) {
      throw err;
    } else {
      const db = client.db('gallery');
      const collection = db.collection('photos');
      app.get('/api/restaurants/:id/gallery', async (req, res) => {
        const { id } = req.params;
        // console.log('server querying for id: ', id);
        const data = await queryDb(id, collection);
        res.json(data);
      // client.close();
      });
    }
  });
  
  app.listen(port, () => console.log(`Gallery App listening on port ${port}!\nbtw you're looking dapper today...`));
  module.exports = app;
}

