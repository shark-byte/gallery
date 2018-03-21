const { MongoClient } = require('mongodb');

async function queryDb(collection, client) {
  const startTime = Date.now();
  for (let i = 1; i <= 1000; i++) {
    collection.find({ place_id: i });
  }
  console.log(`completed in: ${Date.now() - startTime} milliseconds\nwowwww....`);
  client.close();
}

MongoClient.connect('mongodb://localhost/', (err, client) => {
  if (err) {
    throw err;
  } else {
    const db = client.db('test');
    const collection = db.collection('photos');
    queryDb(collection, client).catch();
  }
});
