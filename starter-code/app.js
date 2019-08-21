require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
//with passport, we will no longer use the express session
const session      = require("express-session");
const MongoStore   = require("connect-mongo")(session);

// version with passport requires these:
const passport     = require("passport");
const LocalStrategy= require("passport-local").Strategy;

const User         = require('./models/User');
const bcrypt       = require('bcryptjs');
const flash        = require("connect-flash");

mongoose.Promise = Promise;
mongoose
  .connect('mongodb://localhost/celebrities-project', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup
app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// The default title of the page name
app.locals.title = 'Celebrity Database';

// This is where you can enter a session time to allow the users to view
// certain parts of the app. Remove when using passport:
// app.use(session({
//   secret: "user-accessed page",
//   cookie: { maxAge: 60000 },
//   store: new MongoStore({
//     mongooseConnection: mongoose.connection,
//     ttl: 24 * 60 * 60 // Provides a session that is equivalent to 1 day
//   })
// }));

// PASSPORT VERSION OF SESSION:
app.use(session({
  secret: "anyword",
  resave: true,
  saveUninitialized: true
}));

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

// FOR FLASH MESSAGES:
app.use(flash());

passport.use(new LocalStrategy((username, password, next) => {
  User.findOne({ username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(null, false, { message: "Incorrect username" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, { message: "Incorrect password" });
    }

    return next(null, user);
  });
}));


app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.errorMessage = req.flash('error');
  res.locals.successMessage=req.flash('success');
  console.log(req.user)
  next();
});

// this is the root file - the "/" is the root page of all
// pages
const index = require('./routes/index');
app.use('/', index);

const celebrities = require('./routes/celebrities');
app.use('/celebrities', celebrities);

const userRoutes = require('./routes/user-routes');
app.use(userRoutes)


module.exports = app;
