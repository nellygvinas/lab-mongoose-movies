const express = require('express');
const router  = express.Router();
const User    = require('../models/User');

const bcrypt = require('bcryptjs');
const passport = require("passport");


router.get('/signup', (req, res, next)=>{

  res.render('user-views/signup')

})

router.post('/signup', (req, res, next)=>{

    // Assign username and password from the form to variables.
    // The form values are grabbed used req.body.+ name value of the input
    let username = req.body.theUsername;
    let password = req.body.thePassword;

    // If no username or password upon signup, a message appears
    // and user is redirected to /signup page
    if(!username || !password){
      req.flash('error', 'please provide both the username and password to login.')
      res.redirect('/signup')
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    User.create({username: username, password: hashedPassword})
    .then(()=>{
        res.redirect('/celebrities')
    })
    .catch((err)=>{
        next(err)
    })
})

router.get('/login', (req, res, next)=>{

  res.render('user-views/login')
})


// PREVIOUS LOGIN WITHOUT PASSPORT:
// router.post('/login', (req, res, next)=>{
//   const uName = req.body.theUsername;
//   const pWord = req.body.thePassword;


//   User.findOne({ "username": uName })
//   .then(user => {
//     if (!user) {
//       res.redirect('/signup')
//     }
//     if (bcrypt.compareSync(pWord, user.password)) {
//       // Saves the login in the session info
//       req.session.currentlyLoggedIn = user;
//       res.redirect("/celebrities");
//     } else {
//       res.render("auth/login", {
//         errorMessage: "Incorrect password"
//       });
//     }
//   })
//   .catch(error => {
//     next(error);
//   })

// })

router.post('/login', passport.authenticate('local', {successRedirect: '/celebrities',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true
  })
);


router.post('/logout', (req, res, next)=>{
  req.logout(); 
  // Previous version using express session
  //     req.session.destroy()
  res.redirect('/')
})
    
    
router.get('/members-page', (req, res, next)=>{

  if(!req.user){
    req.flash('error', 'please log in to view the secret page')
    res.redirect('/login')
  }

  res.render('user-views/members-page')

  // Previous version
  //   if(req.session.currentlyLoggedIn){
  //       res.render('user-views/members-page')
  //   } else{
  //       res.redirect('/celebrities')
  //   }


})



module.exports = router;