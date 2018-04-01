// dependencies
const express =  require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const authentication = require('./api/authentication.route');
const products = require('./api/products.route');
const brands = require('./api/brands.route');
const types = require('./api/types.route');
const users = require('./api/users.route');

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
router.use('/api/v1', router);
router.use('/', authentication);
router.use('/products', products);
router.use('/brands', brands);
router.use('/types', types);
router.use('/users', isAdmin, users);

module.exports = router;

function isAdmin(req, res, next) {

  if(req.user.role === 1)
    return next();

  res.redirect('/products');
}
