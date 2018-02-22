const express = require('express');
const router = express.Router();
const BrandController = require('../../conrtrollers/brands.controller');

router.get('/:id', BrandController.getBrand);
router.get('/', BrandController.getBrands);
router.post('/', BrandController.createBrand);
router.put('/:id',BrandController.updateBrand);
router.delete('/:id', BrandController.removeBrand);

// export router
module.exports = router;
