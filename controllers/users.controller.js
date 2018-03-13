// dependencies
const userService = require('../services/users.service');

// variables
_this = this;

// export method that retrieves the applications from the application service
exports.getUsers = (req, res, next) => {
  let page = req.query.page ? req.query.page : 1;
  let limit = req.query.limit ? req.query.limit : 10;

  userService.getUsers({}, page, limit)
    .then((users) => {
      return res.status(200).json(users);
    })
    .catch((e) => {
      return res.status(400).send(e);
    });
};

// export method that retrieves a single user based on id from the user service
exports.getUser = (req, res, next) => {
  let id = req.params.id;

  userService.getUser(id)
    .then((user) => {
      return res.status(200).json(user);
    })
    .catch((e) => {
      return res.status(400).send(e);
    });
};

// export a method that sends a new application to the application service
exports.createUser = (req, res, next) => {
  let user = {
    title: req.body.title
  };
  userService.createUser(user)
    .then((createdUser) => {
      return res.status(201).json(createdUser);
    })
    .catch((e) => {
      return res.status(400).send(e);
    });
};

// export a method that sends new information with id to the application service
exports.updateType = (req, res, next) => {
  let type = {
    _id: req.body._id ? req.body._id : null,
    title: req.body.title ? req.body.title : null
  };
  typeService.updateType(type)
    .then((updatedType) => {
      return res.status(200).json(updatedType)
    })
    .catch((e) => {
      return res.status(400).send(e);
    });
};

// export a method that send a application for removal to the application service
exports.removeType = (req, res, next) => {
  let id = req.params.id;

  typeService.deleteType(id)
    .then((type) => {
      return res.status(204).json(type)
    })
    .catch((e) => {
      return res.status(400).send(e);
    });


};
