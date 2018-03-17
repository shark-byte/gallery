const pgp = require('pg-promise');
const faker = require('faker');

const cn = {
  host: 'localhost',
  port: 5432,
  database: 'wegot',
  user: 'merman',
  password: 'merman',
};

const db = pgp(cn);

function seedDB () {
  db.none('INSERT INTO restaurants VALUES', [2, 'McDonalds']);
}

seedDB();
