const express = require('express');
const router = express.Router();
const typeController = require('../../controllers/types.controller');

router.get('/:id', typeController.getType);
router.get('/', typeController.getTypes);
router.post('/', typeController.createType);
router.put('/:id',typeController.updateType);
router.delete('/:id', typeController.removeType);

// export router
module.exports = router;
