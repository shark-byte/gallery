const { Pool, Client } = require('pg');
const faker = require('faker');

const conString = 'postgres://mdalpozzo@localhost:5432/wegot';

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
  const entriesPerCycle = 1;
  const cycles = 1;

  for (let x = 0; x < cycles; x += 1) {
    const allRestaurants = [];
    const allPhotos = [];
    const allReviews = [];

    for (let i = 1; i <= entriesPerCycle; i += 1) {
      const restaurantEntry = `(${(x * entriesPerCycle) + i}, '${faker.company.companyName()}')`;
      // console.log('restaurant entry: ', restaurantEntry);
      
      // PHOTOS
      const urlsPerRestaurant = [];
      const dimensionsPerPhoto = [];
      for (let j = 0; j < 10; j += 1) {
        const url = `${faker.image.imageUrl()}/?=${Math.floor(Math.random() * 100)}`;
        urlsPerRestaurant.push(url);

        // [width, height]
        const dimensions = [Number(url.split('/')[3]), Number(url.split('/')[4])];
        dimensionsPerPhoto.push(dimensions);
      }
      const photoEntry = `('{"${urlsPerRestaurant.join('", "')}"}', '{{${dimensionsPerPhoto.join('}, {')}}')`;
      // console.log('photoEntry: ', photoEntry);

      // REVIEWS
      const usersPerRestaurant = [];
      const avatarUrlPerUser = [];
      for (let k = 0; k < 5; k += 1) {
        const user = `${faker.name.firstName()} ${faker.name.lastName()}`;
        usersPerRestaurant.push(user);

        const avatarUrl = faker.image.avatar();
        avatarUrlPerUser.push(avatarUrl);
      }
      const reviewEntry = `('{"${usersPerRestaurant.join('", "')}"}', '{"${avatarUrlPerUser.join('", "')}"}')`;
      console.log('reviewEntry: ', reviewEntry);

      allRestaurants.push(restaurantEntry);
      allPhotos.push(photoEntry);
      allReviews.push(reviewEntry);
    }
    console.log('allRestaurants: ', allRestaurants);
    // await client.query(`INSERT INTO restaurants VALUES ${allRestaurants}`);
    // await client.query(`INSERT INTO restaurants VALUES ${allPhotos}`);
    // await client.query(`INSERT INTO restaurants VALUES ${allReviews}`);
  }
  console.log(`finished in ${((Date.now() - startTime) / 1000) / 60} minutes\nLater Gator`);
  client.end();
}

seedDb();
