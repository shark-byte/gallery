const { MongoClient } = require('mongodb');

const dbHost = 'localhost';

async function queryDb(id, collection) {
  const num = Number(id);
  const info = await collection.findOne({ place_id: num });
  return info;
}

module.exports = MongoClient.connect(`mongodb://${dbHost}/`, (err, client) => {
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
        client.close();
      });
    }
  });