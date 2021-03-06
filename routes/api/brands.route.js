const express = require('express');
const router = express.Router();
const brandController = require('../../controllers/brands.controller');

router.get('/:id', brandController.getBrand);
router.get('/', brandController.getBrands);
router.post('/', brandController.createBrand);
router.put('/:id',brandController.updateBrand);
router.delete('/:id', brandController.removeBrand);

// export router
module.exports = router;
