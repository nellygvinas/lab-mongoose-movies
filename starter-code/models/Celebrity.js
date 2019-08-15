//In your models file, always require mongoose 
const mongoose = require('mongoose');
// here we are getting access to the Schema class which is part of mongoose
const Schema = mongoose.Schema;

const celebSchema = new Schema ({
  name: String,
  occupation: String,
  catchPhrase: String

})

// The first value after mongoose.model is the name of the model,
// and will become the collection in the database.
// Mongoose expects the name of the model to be singular
const Celebrity = mongoose.model("Celebrity", celebSchema);

module.exports = Celebrity;