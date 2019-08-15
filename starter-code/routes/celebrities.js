// your routes are actually your controller

const express = require('express');
const router  = express.Router();

const Celebrity = require('../models/Celebrity');

// ****************************************************************************************

// GET - to display the main celebrities page
router.get("/celebrities", (req, res, next) => {
  //res.render("index");
 Celebrity
   .find()
   .then(allCelebrities => res.render("celebrities/index", {allCelebrities}))
   .catch(err => console.log("Error while displaying form for new Celebrity: ", err));
});

// ****************************************************************************************

//


module.exports = router;