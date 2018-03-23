const { MongoClient } = require('mongodb');

// findAll retrieves all stories
// function findAll(callback) {
//   Photos.find({}, callback);
// }

// findOne will retrieve the photo associated with the given id
async function findOne(id, collection, client, callback) {
  const info = await collection.findOne({ place_id: id });
  console.log(info);
  await callback();
  client.close();
}

// insertOne will insert on entry into database
// function insertOne(entry, callback) {
//   Photos.create(entry, callback);
// }

// function insertAll(entries, callback) {
//   return Photos.insertMany(entries, callback);
// }

exports.findOne = findOne;
// exports.insertAll = insertAll;
// exports.findAll = findAll;
// exports.insertOne = insertOne;
