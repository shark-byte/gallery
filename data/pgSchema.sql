DROP TABLE IF EXISTS restaurants CASCADE;
DROP TABLE IF EXISTS photos CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP SCHEMA IF EXISTS gallery;

CREATE SCHEMA gallery;

CREATE TABLE restaurants (
   place_id INTEGER PRIMARY KEY,
   place_name CHAR(50) NOT NULL
);

CREATE TABLE photos (
  url CHAR(100) NOT NULL,
  width smallint NOT NULL,
  height smallint NOT NULL,
  place_id integer references restaurants (place_id)
);

CREATE TABLE reviews (
  name char(50) NOT NULL,
  avatar char(100) NOT NULL,
  place_id integer references restaurants (place_id)
);
