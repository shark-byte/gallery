const { Pool, Client } = require('pg');

const conString = 'postgres://mdalpozzo@localhost:5432/wegot';
// const conString = 'postgres://mdalpozzo@localhost:5432/test';
const client = new Client(conString);
client.connect();

async function grabData() {
  // join 2 tables based on restaurant place_id
  // SELECT * FROM restaurants
  // INNER JOIN photos ON restaurants.place_id = photos.place_id
  // WHERE restaurants.place_id = 99909;
  
  const startTime = Date.now();
  for (let i = 1; i <= 1000; i++) {
    // join 3 tables based on restaurant place_id
    const info = await client.query(`SELECT restaurants.place_id, place_name, url, width, height, name, avatar FROM restaurants
                        INNER JOIN photos ON restaurants.place_id = photos.place_id
                        INNER JOIN reviews ON restaurants.place_id = reviews.place_id
                        WHERE restaurants.place_id = ${i}`);
    // console.log(info);

    // const restaurant = await client.query(`SELECT * FROM restaurants WHERE place_id = ${i}`);
    // const photos = await client.query(`SELECT url FROM photos WHERE place_id = ${i}`);
    // const reviews = await client.query(`SELECT name, avatar FROM reviews WHERE place_id = ${i}`);
    // console.log('restaurant: ', restaurant.rows[0].place_name);
    // console.log('photos: ', photos.rows);
    // console.log('reviews: ', reviews.rows);
  }
  console.log(`finished in ${((Date.now() - startTime))} milliseconds\nLater Gator`);
  client.end();
}

grabData();
