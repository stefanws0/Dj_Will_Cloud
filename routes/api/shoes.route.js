const express = require('express');
const router = express.Router();
const ShoeController = require('../../conrtrollers/shoes.controller');

router.get('/:id', ShoeController.getShoe);
router.get('/', ShoeController.getShoes);
router.post('/', ShoeController.createShoe);
router.put('/:id',ShoeController.updateShoe);
router.delete('/:id', ShoeController.removeShoe);

// export router
module.exports = router;
