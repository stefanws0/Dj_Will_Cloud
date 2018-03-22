const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/', function (req, res) {
  res.render('index.ejs'); // load the index.ejs file
});

router.get('/login', function (req, res) {
  res.format({
    html: function () {
      // render the page and pass in any flash data if it exists
      res.render('login.ejs', {message: req.flash('loginMessage')});
    },
    json: function () {
      res.json("Error");
    }
  });
});

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/dashboard', // redirect to the secure profile section
  failureRedirect: '/login', // redirect back to the signup page if there is an error
  failureFlash: true // allow flash messages
}));

// show the signup form
router.get('/signup', function (req, res) {
  res.format({
    html: function () {
      // render the page and pass in any flash data if it exists
      res.render('signup.ejs', {message: req.flash('signupMessage')});
    },
    json: function () {
      res.json("Error");
    }
  });
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/dashboard', // redirect to the secure profile section
  failureRedirect: '/signup', // redirect back to the signup page if there is an error
  failureFlash: true // allow flash messages
}));

// PROFILE SECTION

// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
router.get('/profile', isLoggedIn, function (req, res) {
  res.format({
    html: function () {
      res.render('profile.ejs', {
        user: req.user // get the user out of session and pass to template
      });
    },
    json: function () {
      res.json(req.user);
    }
  })
});

// LOGOUT
router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

// handle the callback after facebook has authenticated the user
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

// route for logging out
router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

// TWITTER ROUTES
router.get('/auth/twitter', passport.authenticate('twitter'));

// handle the callback after twitter has authenticated the user
router.get('/auth/twitter/callback',
  passport.authenticate('twitter', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

// GOOGLE ROUTES
router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

// the callback after google has authenticated the user
router.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT)

// locally --------------------------------
router.get('/connect/local', function (req, res) {
  res.render('connect-local.ejs', {message: req.flash('loginMessage')});
});
router.post('/connect/local', passport.authenticate('local-signup', {
  successRedirect: '/profile', // redirect to the secure profile section
  failureRedirect: '/connect/local', // redirect back to the signup page if there is an error
  failureFlash: true // allow flash messages
}));

// facebook -------------------------------
router.get('/connect/facebook', passport.authorize('facebook', {
  scope: ['public_profile', 'email']
}));

// handle the callback after facebook has authorized the user
router.get('/connect/facebook/callback',
  passport.authorize('facebook', {
    scope: ['public_profile', 'email'],
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

// twitter --------------------------------
router.get('/connect/twitter', passport.authorize('twitter', {scope: 'email'}));

// handle the callback after twitter has authorized the user
router.get('/connect/twitter/callback',
  passport.authorize('twitter', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

// google ---------------------------------
router.get('/connect/google', passport.authorize('google', {scope: ['profile', 'email']}));

// the callback after google has authorized the user
router.get('/connect/google/callback',
  passport.authorize('google', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

// UNLINK ACCOUNTS

// local -----------------------------------
router.get('/unlink/local', function (req, res) {
  let user = req.user;
  user.local.email = undefined;
  user.local.password = undefined;
  user.save(function (err) {
    res.redirect('/profile');
  });
});

// facebook -------------------------------
router.get('/unlink/facebook', function (req, res) {
  let user = req.user;
  user.facebook.token = undefined;
  user.save(function (err) {
    res.redirect('/profile');
  });
});

// twitter --------------------------------
router.get('/unlink/twitter', function (req, res) {
  let user = req.user;
  user.twitter.token = undefined;
  user.save(function (err) {
    res.redirect('/profile');
  });
});

// google ---------------------------------
router.get('/unlink/google', function (req, res) {
  let user = req.user;
  user.google.token = undefined;
  user.save(function (err) {
    res.redirect('/profile');
  });
});

function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}


module.exports = router;
