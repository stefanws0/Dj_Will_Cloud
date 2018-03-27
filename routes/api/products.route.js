const express = require('express');
const router = express.Router();
const productController = require('../../controllers/products.controller');

router.get('/', (req, res)=> {
  res.redirect('/products/1');
});

router.get('/:id/edit', productController.getProduct);
router.get('/:page', productController.getProducts);
router.post('/', productController.createProduct);
router.put('/:id',productController.updateProduct);
router.delete('/:id', productController.removeProduct);

// export router
module.exports = router;
