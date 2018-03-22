// dependencies
const express =  require('express');
const router = express.Router();
const authentication = require('./api/authentication.route');
const products = require('./api/products.route');
const brands = require('./api/brands.route');
const types = require('./api/types.route');

router.use('/', authentication);
router.use('/products', products);
router.use('/brands', brands);
router.use('/types', types);

module.exports = router;
