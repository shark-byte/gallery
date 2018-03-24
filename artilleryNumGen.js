
// Make sure to "npm install faker" first.
const faker = require('faker');
  
function generateRandomData(placeContext, events, done) {
  // generate data with Faker:
  const id = faker.random.number(1000000);
    // add variables to virtual user's context:
    placeContext.vars.id = id;
    
  // continue with executing the scenario:
  return done();
}
          
module.exports = {
  generateRandomData,
};
