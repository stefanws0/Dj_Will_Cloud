const productService = require('../services/products.service');

module.exports = function (app, passport) {

  app.get('/', function (req, res) {
    res.render('index.ejs'); // load the index.ejs file
  });
  app.get('/login', function (req, res) {
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

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/dashboard', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // show the signup form
  app.get('/signup', function (req, res) {
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

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/dashboard', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // PROFILE SECTION

  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)
  app.get('/profile', isLoggedIn, function (req, res) {
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
  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  // CRUD ROUTES

  //dashboard
  app.get('/dashboard', function (req, res) {
    res.render('dashboard.ejs');
  });

  //products
  app.get('/dashboard/products', function (req, res) {

    let page = req.query.page ? req.query.page : 1;
    let limit = req.query.limit ? req.query.limit : 10;

    productService.getProducts({}, page, limit).then((products) => {
      console.log(products.docs);
      res.format({
        html: function () {
          res.render('products/index.ejs', {
            products: products.docs // get the user out of session and pass to template
          });
        },
        json: function () {
          res.json(products.docs);
        }
      })
    });

  });

  //brands

  // FACEBOOK ROUTES

  // route for facebook authentication and login
  app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

  // handle the callback after facebook has authenticated the user
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/profile',
      failureRedirect: '/'
    }));

  // route for logging out
  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  // TWITTER ROUTES
  app.get('/auth/twitter', passport.authenticate('twitter'));

  // handle the callback after twitter has authenticated the user
  app.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
      successRedirect: '/profile',
      failureRedirect: '/'
    }));

  // GOOGLE ROUTES
  app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

  // the callback after google has authenticated the user
  app.get('/auth/google/callback',
    passport.authenticate('google', {
      successRedirect: '/profile',
      failureRedirect: '/'
    }));

// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT)

  // locally --------------------------------
  app.get('/connect/local', function (req, res) {
    res.render('connect-local.ejs', {message: req.flash('loginMessage')});
  });
  app.post('/connect/local', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/connect/local', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // facebook -------------------------------
  app.get('/connect/facebook', passport.authorize('facebook', {
    scope: ['public_profile', 'email']
  }));

  // handle the callback after facebook has authorized the user
  app.get('/connect/facebook/callback',
    passport.authorize('facebook', {
      scope: ['public_profile', 'email'],
      successRedirect: '/profile',
      failureRedirect: '/'
    }));

  // twitter --------------------------------
  app.get('/connect/twitter', passport.authorize('twitter', {scope: 'email'}));

  // handle the callback after twitter has authorized the user
  app.get('/connect/twitter/callback',
    passport.authorize('twitter', {
      successRedirect: '/profile',
      failureRedirect: '/'
    }));

  // google ---------------------------------
  app.get('/connect/google', passport.authorize('google', {scope: ['profile', 'email']}));

  // the callback after google has authorized the user
  app.get('/connect/google/callback',
    passport.authorize('google', {
      successRedirect: '/profile',
      failureRedirect: '/'
    }));

// UNLINK ACCOUNTS

  // local -----------------------------------
  app.get('/unlink/local', function (req, res) {
    let user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect('/profile');
    });
  });

  // facebook -------------------------------
  app.get('/unlink/facebook', function (req, res) {
    let user = req.user;
    user.facebook.token = undefined;
    user.save(function (err) {
      res.redirect('/profile');
    });
  });

  // twitter --------------------------------
  app.get('/unlink/twitter', function (req, res) {
    let user = req.user;
    user.twitter.token = undefined;
    user.save(function (err) {
      res.redirect('/profile');
    });
  });

  // google ---------------------------------
  app.get('/unlink/google', function (req, res) {
    let user = req.user;
    user.google.token = undefined;
    user.save(function (err) {
      res.redirect('/profile');
    });
  });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}

function isFromApplication(req) {
  return req.headers.accept === "application/json";
}
