const { Pool, Client } = require('pg');

const conString = 'postgres://mdalpozzo@localhost:5432/wegot';
// const pool = new Pool(conString);
// pool.connect();
const client = new Client(conString);
client.connect();

async function grabData() {
  // join 2 tables based on restaurant place_id
  // SELECT * FROM restaurants
  // INNER JOIN photos ON restaurants.place_id = photos.place_id
  // WHERE restaurants.place_id = 99909;
  
  // join 3 tables based on restaurant place_id
  for (let i = 1; i < 2; i++) {
    // const info = await client.query(`SELECT * FROM restaurants
    //                     INNER JOIN photos ON restaurants.place_id = photos.place_id
    //                     INNER JOIN reviews ON restaurants.place_id = reviews.place_id
    //                     WHERE restaurants.place_id = ${i}`);
    const info = await client.query(`SELECT * FROM restaurants WHERE place_id = ${i}`);
    const info2 = await client.query(`SELECT * FROM photos WHERE place_id = ${i}`);
    const info3 = await client.query(`SELECT * FROM reviews WHERE place_id = ${i}`);
    console.log(info);
    console.log(info2);
    console.log(info3);
  }
  client.end();
}

grabData();
