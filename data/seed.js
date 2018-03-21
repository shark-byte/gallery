const faker = require('faker');
const { MongoClient } = require('mongodb');
// const _ = require('ramda');
// const cluster = require('cluster');
// const numCPUs = require('os').cpus().length; // how many cores do i have?

async function seedDb(collection, client) {
  console.log('started seeding');
  const startTime = Date.now();
  const entriesPerCycle = 10000;
  const cycles = 1000;

  for (let x = 0; x < cycles; x++) {
    const allEntries = [];
    for (let i = 1; i <= entriesPerCycle; i++) {
      // console.log('seeding...', i);
      const entry = {
        place_id: (x * entriesPerCycle) + i,
        place_name: faker.company.companyName(),
        photos: [],
        reviews: [],
      };
      // push photo details to entry
      for (let j = 0; j < 10; j += 1) {
        const url = `${faker.image.imageUrl()}/?=${Math.floor(Math.random() * 100)}`;
        const width = url.split('/')[3];
        const height = url.split('/')[4];
        entry.photos.push({
          url,
          width,
          height,
        });
      }
      // push each review to entry
      for (let k = 0; k < 5; k += 1) {
        const review = {
          name: `${faker.name.firstName()} ${faker.name.lastName()}`,
          avatar: faker.image.avatar(),
        };
        entry.reviews.push(review);
      }
      allEntries.push({ insertOne: entry });
    }
    // await collection.insertMany(allEntries);
    await collection.bulkWrite(allEntries, { ordered: false });
  }
  console.log(`finished in ${((Date.now() - startTime) / 1000) / 60} minutes\nLater Gator`);
  client.close();
}

MongoClient.connect('mongodb://localhost/', (err, client) => {
  if (err) {
    throw err;
  } else {
    const db = client.db('test');
    const collection = db.collection('photos');
    seedDb(collection, client).catch();
  }
});

module.exports = seedDb;
