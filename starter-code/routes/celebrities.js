// your routes are actually your controller

const express = require('express');
const router  = express.Router();

const Celebrity = require('../models/Celebrity');

// ****************************************************************************************

// GET - to display the main celebrities page
router.get("/", (req, res, next) => {
  //res.render("index");
 Celebrity
   .find()
   .then(allCelebrities => res.render("celeb-views/celeb-list", {allCelebrities}))
   .catch(err => console.log("Error while displaying form for new Celebrity: ", err));
});

// ****************************************************************************************


router.get('/celeb-details/:idVariable', (req,res,next) => {
  const theID = req.params.idVariable;

  Celebrity.findById(theID)
  .then((result)=>{
    res.render('celeb-views/celeb-details', {aSingleCelebrity:result})
  })
  .catch((err)=>{
    next(err)
  })
})

router.get('/new', (req, res, next)=>{
  res.render('celeb-views/new-celebrity')
  //res render take a relative path as the argument
})


router.post('/create', (req, res, next)=>{
  let newName = req.body.celebName;
  let newJob = req.body.celebOccupation;
  let newPhrase = req.body.celebCatchphrase;

  Celebrity.create({
    name: newName,
    occupation: newJob,
    catchphrase: newPhrase,
  })
  .then((result) => {
    //redirect takes the url as an argument. 
    res.redirect('/celebrities')
  })
  .catch((err)=>{
    next(err)
  })
})

router.get('/edit/:id', (req, res, next)=>{
  Celebrity.findById(req.params.id)
  .then((theResult)=>{
    res.render('celeb-views/edit', {celebrityToUpdate: theResult} )
  })
  .catch((err)=>{
    next(err);
  })
})

router.post('/update/:id', (req, res, next)=>{

  Celebrity.findByIdAndUpdate(req.params.id,req.body)
  .then(()=>{
    res.redirect('/celebrities/celeb-details/'+req.params.id)
  })
 .catch((err)=>{
   next(err)
 })

})

// placing the id in the url as a variable removes the error that is
// received once you run the program. Otherwise, program keeps assigning
// whatever comes after the / to the id
router.post('/:id/delete', (req, res, next)=>{
  const id=req.params.id;

  Celebrity.findByIdAndRemove(id)
  .then(()=>{
    res.redirect('/celebrities')
  })
  .catch((err)=>{
    next(err);
  })
})



module.exports = router;