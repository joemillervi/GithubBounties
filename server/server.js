var express = require('express');
var bodyParser = require('body-parser');
var app = express();
// For github auth and sessions
var passport = require('passport');
var session = require('express-session');
var methodOverride = require('method-override');
var GitHubStrategy = require('passport-github2').Strategy;
var partials = require('express-partials');

var db = require('./db/database');
var config = require('./config')

var stripe = require("stripe")("sk_test_BQokikJOvBiI2HlWgH4olfQ2");

var Issues = require('./models/issues');
Issues = new Issues();

var Repos = require('./models/repos');
Repos = new Repos();

var Users = require('./models/users');
Users = new Users();

// configure express
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client'));

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

var port = process.env.PORT || 3000;

app.route('/api')
  .get(function(req, res) {
    res.send('Hello World');
  });

app.route('/api/issues')
  .get(function(req, res) {
    Issues.getIssues()
    .then((results) => res.send(results))
    .catch((err) => {
      console.log(err);
      res.statusCode = 501;
      res.send('Unknown Server Error');
    });
  });

app.route('/api/bounties')
  .get(function(req, res) {
    Issues.getBounties()
    .then((results) => res.send(results))
    .catch((err) => {
      console.log(err);
      res.statusCode = 501;
      res.send('Unknown Server Error');
    });
  });

app.route('/api/repos')
  .get(function(req, res) {
    Repos.getRepos()
    .then((results) => res.send(results))
    .catch(() => {
      res.statusCode = 501;
      res.send('Unknown Server Error');
    });
  });

// for github auth
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);

passport.use(new GitHubStrategy({
    clientID: config.GITHUB_CLIENT,
    clientSecret: config.GITHUB_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      // save to db
      Users.createUser(profile)
      .then(() => {
        Users.createUser(profile);
        console.log('Saved new user');
      })
      .catch((err) => {
        console.log(err)
        // res.statusCode = 501;
        // res.send('Unknown Server Error');
      });
      // To keep the example simple, the user's GitHub profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the GitHub account with a user record in your database,
      // and return that user instead.
      console.log(profile)
      return done(null, profile);
    });
  }
));

app.use(partials());
app.use(methodOverride());
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions
app.use(passport.initialize());
app.use(passport.session());

// GET /auth/github
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in GitHub authentication will involve redirecting
//   the user to github.com.  After authorization, GitHub will redirect the user
//   back to this application at /auth/github/callback
app.get('/gitHubRedirect',
  passport.authenticate('github', { scope: [ 'user:email' ] }),
  function(req, res){
    // The request will be redirected to GitHub for authentication, so this
    // function will not be called.
  });

// GET /auth/github/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

app.get('/fetchUserInfo', function(req, res) {
  console.log('on cookie: ', req.session)
  res.json(req.session.passport.user)
})
// NOT SURE IF NEEDED
//   serverResponse.end(JSON.stringify(token));
// });

app.route('/stripe')
  .post(function(req, res) {
    var stripeToken = req.body.stripeToken;
    stripe.customers.create({
      source: stripeToken,
    }).then((customer) => {
      Users.saveId(customer.id, 3) // need to pass currently logged in userID here
      .then(() => {
        console.log('saved customer ID to DB');
      })
      .catch(() => {
        res.statusCode = 501;
        res.send('Unknown Server Error');
      });
    });
  });

console.log(`server running on port ${port} in ${process.env.NODE_ENV} mode`);
// start listening to requests on port 3000
app.listen(port);

// export our app for testing and flexibility, required by index.js
module.exports = app;
