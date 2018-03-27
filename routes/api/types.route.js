const express = require('express');
const router = express.Router();
const typeController = require('../../controllers/types.controller');

router.get('/', (req, res)=> {
  res.redirect('/types/1');
});

router.get('/:id/edit', typeController.getType);
router.get('/:page', typeController.getTypes);
router.post('/', typeController.createType);
router.put('/:id',typeController.updateType);
router.delete('/:id', typeController.removeType);

// export router
module.exports = router;
