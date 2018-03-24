function generateRandomData(placeContext, events, done) {
  const id = Math.round(Math.random() * 1000000);
  // add variables to virtual user's context:
  placeContext.vars.id = id;
    
  // continue with executing the scenario:
  return done();
}
          
module.exports = {
  generateRandomData,
};
