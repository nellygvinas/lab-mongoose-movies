// your routes are actually your controller

const express = require('express');
const router  = express.Router();

const Celebrity = require('../models/Celebrity');

// ****************************************************************************************

// GET - to display the main celebrities page
router.get("/", (req, res, next) => {
  
  // Using passport, we can see if a user is logged in. we can show a message
  if(!req.user){
    req.flash('error', 'please login to view actors profiles')
    res.redirect('/login')
  }
  console.log('------------------------')
  console.log("req.user:",req.user)
  
  //res.render("index");
  
  Celebrity.find()
  .then((result) => {
    // This was the previous res.render. Now we want to show a list with celebrites and creater
    // (user) data showing.
    //  res.render("celeb-views/celeb-list", { allCelebrities:result, user: req.session.currentlyLoggedIn}}))
    console.log("LIST OF CELEBRITIES --------------",result);
    // Now we are adding the creator to the celebrity list. the creater was added
    // to the User model.
    let newList = result.map((eachCeleb)=>{
      // In Mongoose, you cannot do the "=". Have to do the .equals
   /* ERROR*/ if(eachCeleb.creator.equals(req.user._id)){
        // if the celeb creater id matches the req user id, we set the .owned property to true
        eachCeleb.owned = true;
        return eachCeleb
      } else{
        return eachCeleb;
      }
    }) // end of new list map. We map the result of the .then
      console.log("NEW MAPPED LIST", newList);
      res.render('celeb-views/celeb-list', {allCelebrities: newList});

   })
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

// Grab the new celeb name, occupation and catchphrase from
// the inputs on the form. Use req.body."input name"
  let newName = req.body.celebName;
  let newJob = req.body.celebOccupation;
  let newPhrase = req.body.celebCatchphrase;

  Celebrity.create({
    name: newName,
    occupation: newJob,
    catchphrase: newPhrase,
    creator: req.user._id
  })
  .then((result) => {
    //redirect takes the url as an argument. 
    req.flash('success','New Celebrity successfully addded to Database')
    res.redirect('/celebrities')
  })
  .catch((err)=>{
    next(err)
  })
})

router.get('/edit/:id', (req, res, next)=>{
  Celebrity.findById(req.params.id)
  .then((theResult)=>{
    // Previous way we did it:
    // res.render('celeb-views/edit', {celebrityToUpdate: theResult} )
    if(req.user._id.equals(theResult.creator)){
      res.render('celeb-views/edit', {celebrityToUpdate: theResult})
    } else{
      req.flash('error', 'sorry you can only edit your own celebrities');
      res.redirect('/celebrities');
    }

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