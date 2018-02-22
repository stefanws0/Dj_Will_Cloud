// dependencies
const express =  require('express');
const router = express.Router();
const shoes = require('./api/shoes.route');

router.use('/shoes', shoes);

module.exports = router;
