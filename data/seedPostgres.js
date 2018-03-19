const { Pool, Client } = require('pg');
const faker = require('faker');

const conString = 'postgres://merman:merman@localhost:5432/wegot';

// const pool = new Pool(conString);
// pool.connect();
const client = new Client(conString);
client.connect();

// async function test() {
//   const res = await client.query('SELECT $1::text as message', ['Hello world!']);
//   console.log(res.rows[0].message);
//   client.end();
// }
// test();

async function seedDb() {
  console.log('started seeding');
  const startTime = Date.now();
  const entriesPerCycle = 100;
  const cycles = 100;

  for (let x = 0; x < cycles; x += 1) {
    const allRestaurants = [];
    const allPhotos = [];
    const allReviews = [];

    for (let i = 1; i <= entriesPerCycle; i += 1) {
      const restaurants = `(${(x * entriesPerCycle) + i}, \$\$${faker.company.companyName}\$\$)`;
      allRestaurants.push(restaurants);
      const photos = [];
      const reviews = [];

      for (let j = 0; j < 10; j += 1) {
        const url = `${faker.image.imageUrl()}/?=${Math.floor(Math.random() * 100)}`;
        const width = Number(url.split('/')[3]);
        const height = Number(url.split('/')[4]);
        const entry = `\$\$${url}\$\$, ${width}, ${height}`;
        photos.push(entry);
      }

      for (let k = 0; k < 5; k += 1) {
        const entry = `\$\$${faker.name.firstName()} ${faker.name.lastName()}\$\$, \$\$${faker.image.avatar()}\$\$`;
        reviews.push(entry);
      }
      await client.query(`INSERT INTO restaurants VALUES ${restaurants}`);
      await client.query(`INSERT INTO restaurants VALUES ${photos}`);
      await client.query(`INSERT INTO restaurants VALUES ${reviews}`);
    }
  }
  console.log(`finished in ${((Date.now() - startTime) / 1000) / 60} minutes\nLater Gator`);
  client.end();
}

seedDb();
