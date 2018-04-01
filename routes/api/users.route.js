const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/users.controller');

router.get('/:id', usersController.getUser);
router.get('/', usersController.getUsers);
router.put('/:id',usersController.updateUser);
router.delete('/:id', usersController.removeUser);

// export router
module.exports = router;
