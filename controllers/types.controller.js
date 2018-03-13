// dependencies
const typeService = require('../services/types.service');

// variables
_this = this;

// export method that retrieves the applications from the application service
exports.getTypes = (req, res, next) => {
  let page = req.query.page ? req.query.page : 1;
  let limit = req.query.limit ? req.query.limit : 10;

  typeService.getTypes({}, page, limit)
    .then((types) => {
      return res.status(200).json(types);
    })
    .catch((e) => {
      return res.status(400).send(e);
    });
};

// export method that retrieves a single application based on id from the application service
exports.getType = (req, res, next) => {
  let id = req.params.id;

  typeService.getType(id)
    .then((type) => {
      return res.status(200).json(type);
    })
    .catch((e) => {
      return res.status(400).send(e);
    });
};

// export a method that sends a new application to the application service
exports.createType = (req, res, next) => {
  let type = {
    title: req.body.title
  };
  typeService.createType(type)
    .then((createdType) => {
      return res.status(201).json(createdType);
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
