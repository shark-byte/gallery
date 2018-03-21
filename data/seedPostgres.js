const { Pool, Client } = require('pg');
const faker = require('faker');
const _ = require('ramda');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length; // 4

const conString = 'postgres://mdalpozzo@localhost:5432/test';

// const pool = new Pool(conString);
// pool.connect();
const client = new Client(conString);
client.connect();

async function seedDb() {
  const startTime = Date.now();
  const totalEntries = 10000000;
  const entriesPerWorker = Math.ceil(totalEntries / numCPUs);
  const entriesPerCycle = 1000;
  const cycles = Math.ceil(entriesPerWorker / entriesPerCycle);
  const workerID = Number(process.env.id);
  // console.log('WORKER ID ID ID: ', workerID);

  console.log(`started seeding ${entriesPerCycle * cycles} entries`);

  await client.query('BEGIN');
  for (let x = 0; x < cycles; x += 1) {
    let allRestaurants = [];
    let allPhotos = [];
    let allReviews = [];

    for (let i = 1; i <= entriesPerCycle; i += 1) {
      // PAGINATION EQUATION FOR UNIQUE IDS
      const restaurantId = (((x * entriesPerCycle) + i) + (workerID * entriesPerWorker));
      const restaurantEntry = `(${restaurantId}, \$\$${faker.company.companyName()}\$\$)`;
      // console.log(workerID, restaurantEntry);
      
      // PHOTOS
      const photoEntry = [];
      for (let j = 0; j < 10; j += 1) {
        const url = `${faker.image.imageUrl()}/?=${Math.floor(Math.random() * 100)}`;
        const width = Number(url.split('/')[3]);
        const height = Number(url.split('/')[4]);
        photoEntry.push(`(\$\$${url}\$\$, ${width}, ${height}, ${restaurantId})`);
      }
      // console.log('photoEntry: ', photoEntry);

      // REVIEWS
      const reviewEntry = [];
      for (let k = 0; k < 5; k += 1) {
        const user = `${faker.name.firstName()} ${faker.name.lastName()}`;
        const avatarUrl = faker.image.avatar();
        reviewEntry.push(`(\$\$${user}\$\$, \$\$${avatarUrl}\$\$, ${restaurantId})`);
      }
      // console.log('reviewEntry: ', reviewEntry);

      allRestaurants.push(restaurantEntry);
      allPhotos.push(photoEntry);
      allReviews.push(reviewEntry);
    }
    allRestaurants = allRestaurants.join(', ');
    allPhotos = allPhotos.join(', ');
    allReviews = allReviews.join(', ');
    await client.query(`INSERT INTO restaurants VALUES ${allRestaurants}`);
    await client.query(`INSERT INTO photos VALUES ${allPhotos}`);
    await client.query(`INSERT INTO reviews VALUES ${allReviews}`);
  }
  await client.query('COMMIT');
  console.log(`finished in ${((Date.now() - startTime) / 1000) / 60} minutes\nLater Gator`);
  console.log('creating indexes on restaurants: place_id, photos: place_id, reviews: place_id');
  await client.query('CREATE INDEX restaurants_place_id_index ON restaurants (place_id)');
  await client.query('CREATE INDEX photos_place_id_index ON photos (place_id)');
  await client.query('CREATE INDEX reviews_place_id_index ON reviews (place_id)');
  client.end();
}

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork({
      id: i,
    });
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} finished`);
  });
} else {
  seedDb();
  console.log(`Worker ${process.pid} started`);
}
