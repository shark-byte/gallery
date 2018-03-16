// const data = require('./allData.js');
// const Photos = require('../database/index.js');
const mongoose = require('mongoose');
const faker = require('faker');
const MongoClient = require('mongodb').MongoClient;
// const _ = require('ramda');
// const cluster = require('cluster');
// const numCPUs = require('os').cpus().length; // how many cores do i have?

MongoClient.connect('mongodb://localhost/',(err, client) => {
  if (err) {
    throw err;
  } else {
    const db = client.db('photos');
    const collection = db.collection('photos');
    seedDb(collection).catch();
  }
});


// mongoose.connect('mongodb://localhost/test', (err) => {
//   if (err) {
//     throw err;
//   } else {
//     console.log('mongoose connected');
//   }
// })
//   .then(() => seedDb());

async function seedDb(collection) {
  console.log('started seeding');
  startTime = Date.now();
  const entriesPerCycle = 1000;
  const place_name = faker.company.companyName();

  for (let x = 0; x < 10000; x++) {
    const allEntries = [];
    for (let i = 1; i <= entriesPerCycle; i++) {
      // console.log('seeding...', i);
      const entry = {
        place_id: (x * entriesPerCycle) + i,
        place_name,
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
          height
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
      allEntries.push({ insertOne: entry});
    }
      await collection.bulkWrite(allEntries, { ordered: false });
  }
  console.log('done');
  console.log((((Date.now() - startTime) / 1000) / 60) + 'seconds');
}

// async function seedDb() {
//   startTime = Date.now();
//   const entriesPerCycle = 1000;
//   for (let x = 0; x < 1000; x++) {
//     const allEntries = [];
//     for (let i = 1; i <= entriesPerCycle; i++) {
//       // console.log('seeding...', i);
//       const entry = {
//         place_id: (x * entriesPerCycle) + i,
//         place_name: faker.company.companyName(),
//         photos: [],
//         reviews: [],
//       };
//       // push photo details to entry
//       for (let j = 0; j < 10; j += 1) {
//         const url = `${faker.image.imageUrl()}/?=${Math.floor(Math.random() * 100)}`;
//         const width = url.split('/')[3];
//         const height = url.split('/')[4];
//         entry.photos.push({
//           url,
//           width,
//           height
//         });
//       }
//       // push each review to entry
//       for (let k = 0; k < 5; k += 1) {
//         const review = {
//           name: `${faker.name.firstName()} ${faker.name.lastName()}`,
//           avatar: faker.image.avatar(),
//         };
//         entry.reviews.push(review);
//       }
//       allEntries.push(entry);
//     }
//     await Photos.insertAll(allEntries);
//   }
//   console.log('done!');
//   console.log((((Date.now() - startTime) / 1000) / 60) + 'seconds');
//   // mongoose.connection.close();
// }


module.exports = seedDb;
