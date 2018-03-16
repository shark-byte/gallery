const mongoose = require('mongoose');

const PhotosSchema = mongoose.Schema({
  url: String,
  width: Number,
  height: Number,
});

const ReviewSchema = mongoose.Schema({
  name: String,
  avatar: String,
});

const photoSchema = mongoose.Schema({
  place_id: {
    type: String,
    unique: true,
  },
  place_name: String,
  photos: [PhotosSchema],
  reviews: [ReviewSchema],
});

const Photos = mongoose.model('Photos', photoSchema);

// findAll retrieves all stories
function findAll(callback) {
  Photos.find({}, callback);
}

// findOne will retrieve the photo associated with the given id
function findOne(id, callback) {
  console.log('database finding by id:', id);
  Photos.find({
    place_id: id,
  }, callback);
}

// insertOne will insert on entry into database
function insertOne(entry, callback) {
  Photos.create(entry, callback);
}

function insertAll(entries, callback) {
  return Photos.insertMany(entries, callback);
}

exports.insertAll = insertAll;
exports.findOne = findOne;
exports.findAll = findAll;
exports.insertOne = insertOne;
