const express = require('express');
const router = express.Router();
const brandController = require('../../controllers/brands.controller');

router.get('/', (req, res)=> {
  res.redirect('/brands/1');
});

router.get('/:id/edit', brandController.getBrand);
router.get('/:page', brandController.getBrands);
router.post('/', brandController.createBrand);
router.put('/:id',brandController.updateBrand);
router.delete('/:id', brandController.removeBrand);

// export router
module.exports = router;
