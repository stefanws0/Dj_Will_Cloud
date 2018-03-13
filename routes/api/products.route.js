const express = require('express');
const router = express.Router();
const productController = require('../../controllers/products.controller');

router.get('/:id', productController.getProduct);
router.get('/', productController.getProducts);
router.post('/', productController.createProduct);
router.put('/:id',productController.updateProduct);
router.delete('/:id', productController.removeProduct);

// export router
module.exports = router;
