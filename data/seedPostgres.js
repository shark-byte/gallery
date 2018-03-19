const { Pool, Client } = require('pg');
const faker = require('faker');

const conString = 'postgres://mdalpozzo@localhost:5432/wegot';

// const pool = new Pool(conString);
// pool.connect();
const client = new Client(conString);
client.connect();

async function seedDb() {
  const startTime = Date.now();
  const entriesPerCycle = 1000;
  const cycles = 1000;
  console.log(`started seeding ${entriesPerCycle * cycles} entries`);

  for (let x = 0; x < cycles; x += 1) {
    let allRestaurants = [];
    let allPhotos = [];
    let allReviews = [];

    for (let i = 1; i <= entriesPerCycle; i += 1) {
      const restaurantId = (x * entriesPerCycle) + i;
      const restaurantEntry = `(${restaurantId}, \$\$${faker.company.companyName()}\$\$)`;
      
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
  console.log(`finished in ${((Date.now() - startTime) / 1000) / 60} minutes\nLater Gator`);
  client.end();
}

seedDb();
