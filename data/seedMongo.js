const faker = require('faker');
const { MongoClient } = require('mongodb');
// const _ = require('ramda');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length; // 4

const dbHost = process.env.DATABASE_HOST || 'database'; // 'database' for docker

async function seedDb(collection, client) {
  console.log('started seeding');
  const startTime = Date.now();
  const totalEntries = 1000000;
  const entriesPerWorker = Math.ceil(totalEntries / numCPUs);
  const entriesPerCycle = 1000;
  const cycles = Math.ceil(entriesPerWorker / entriesPerCycle);
  const workerID = Number(process.env.id);

  console.log(`Worker ${workerID} started seeding ${entriesPerWorker} entries`);

  for (let x = 0; x < cycles; x++) {
    const allEntries = [];
    for (let i = 1; i <= entriesPerCycle; i++) {
      // console.log('seeding...', i);
      const entry = {
        place_id: (((x * entriesPerCycle) + i) + (workerID * entriesPerWorker)),
        place_name: faker.company.companyName(),
        photos: [],
        reviews: [],
      };
      // push photo details to entry
      for (let j = 0; j < 10; j += 1) {
        const src = `https://picsum.photos/640/480/?image=${Math.floor(Math.random() * 1000)}`;
        const width = Number(src.split('/')[3]);
        const height = Number(src.split('/')[4]);
        entry.photos.push({
          src,
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
  const dbEndCount = await collection.count();
  console.log(`Worker ${workerID} done, dbCount: ${dbEndCount}`);
  if (dbEndCount >= totalEntries) {
    console.log('creating indexes...');
    await collection.createIndex({ place_id: 'hashed' });
  }
  process.exit(); // DO I NEED THIS TO CLOSE EACH WORKER'S PROCESS???
  client.close();
}

MongoClient.connect(`mongodb://${dbHost}/`, async (err, client) => {
  if (err) {
    throw err;
  } else {
    const db = client.db('gallery');
    const collection = db.collection('photos');

    if (cluster.isMaster) {
      const databaseCount = await collection.count();
      if (databaseCount === 0) {
        console.log(`Master ${process.pid} is running`);
      
        for (let i = 0; i < numCPUs; i++) {
          cluster.fork({
            id: i,
          });
        }
      
        cluster.on('exit', (worker, code, signal) => {
          console.log(`Worker ${worker.process.pid} finished`);
        });
      }
      client.close();
    } else {
      seedDb(collection, client).catch();
      console.log(`Worker ${process.pid} started`);
    }
  }
});

module.exports = seedDb;
