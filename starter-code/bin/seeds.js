const mongoose = require('mongoose');
const Celebrity = require('../models/Celebrity');

const dbName = 'celebrities-project';
mongoose.connect(`mongodb://localhost/${dbName}`);

const celebrities = [
  {
    name: "Tim Gunn",
    occupation: "fashion designer",
    catchPhrase: "Make it work."
  },
  {
    name: "Helga Pataki",
    occupation: "student",
    catchPhrase: "Move it, footballhead."
  },
  {
    name: "Charlie Brown",
    occupation: "kid",
    catchPhrase: "Good grief."
  }
]

Celebrity.create(celebrities, (err) => {
  if (err) { throw(err) }
  console.log(`Created ${celebrities.length} celebrities`)
  mongoose.connection.close();
});