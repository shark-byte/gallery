const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path');

// const dbHost = process.env.DATABASE_HOST || 'localhost';
const dbHost = 'database';
// const { findOnePlace } = require('../database/index.js');

const port = 3001;

const app = express();

app.use(cors());
app.use(bodyParser.json());
// serve static files from dist dir
app.use('/restaurants/:id', express.static(path.join(__dirname, '../client/dist')));

// if no ID typed into url bar, redirect to this ID
app.get('/', (req, res) => {
  res.status(200).redirect('/restaurants/4');
});

async function queryDb(id, collection) {
  const num = Number(id);
  const info = await collection.findOne({ place_id: num });
  // console.log('in queryDb function:', info);
  return info;
}

// retrieve data from API(db)
MongoClient.connect(`mongodb://${dbHost}/`, (err, client) => {
  if (err) {
    throw err;
  } else {
    const db = client.db('gallery');
    const collection = db.collection('photos');
    app.get('/api/restaurants/:id/gallery', async (req, res) => {
      const { id } = req.params;
      console.log('server querying for id: ', id);
      // const data = await collection.findOne({ place_id: id });
      // console.log(data);
      // res.json(data);
      const data = await queryDb(id, collection);
      console.log('whyyyyy:', data);
      res.json(data);
    });
  }
});

app.listen(port, () => console.log(`Gallery App listening on port ${port}!\nbtw you're looking dapper today...`));

module.exports = app;
