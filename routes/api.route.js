// dependencies
const express =  require('express');
const router = express.Router();
const authentication = require('./api/authentication.route');
const products = require('./api/products.route');
const brands = require('./api/brands.route');
const types = require('./api/types.route');
const users = require('./api/users.route');

router.use('/', authentication);
router.use('/products', isLoggedIn, products);
router.use('/brands', isLoggedIn, brands);
router.use('/types', isLoggedIn, types);
router.use('/users', isLoggedIn, isAdmin, users);

module.exports = router;

function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}

function isAdmin(req, res, next) {

  if(req.user.role === 1)
    return next();

  res.redirect('/products');
}
