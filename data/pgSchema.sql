DROP TABLE IF EXISTS restaurants;
DROP TABLE IF EXISTS photos;
DROP TABLE IF EXISTS reviews;

CREATE SCHEMA gallery;

CREATE TABLE restaurants (
   place_id NUMERIC NOT NULL,
   place_name VARCHAR(30) NOT NULL,
   CONSTRAINT employees_pk PRIMARY KEY (place_id)
);

CREATE TABLE photos (
  url VARCHAR(200) NOT NULL,
  width SMALLINT NOT NULL,
  height SMALLINT NOT NULL
);

CREATE TABLE reviews (
  name VARCHAR(50) NOT NULL,
  avatar VARCHAR(200)
);
