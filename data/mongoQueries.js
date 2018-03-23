const { MongoClient } = require('mongodb');

async function queryDb(collection, client) {
  const startTime = Date.now();
  for (let i = 1; i <= 1; i++) {
    const info = await collection.findOne({ place_id: Math.round(Math.random() * 10000000) });
    console.log(info);
  }
  console.log(`completed in: ${Date.now() - startTime} milliseconds\nwowwww....`);
  client.close();
}

MongoClient.connect('mongodb://localhost/', (err, client) => {
  if (err) {
    throw err;
  } else {
    const db = client.db('photos');
    const collection = db.collection('photos');
    queryDb(collection, client).catch();
  }
});
