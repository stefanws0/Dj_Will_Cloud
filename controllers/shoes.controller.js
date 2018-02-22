// dependencies
const ShoeService = require('../services/shoes.service');

// variables
_this = this;

// export method that retrieves the applications from the application service
exports.getShoes = (req, res, next) => {
  let page = req.query.page ? req.query.page : 1;
  let limit = req.query.limit ? req.query.limit : 10;

  ShoeService.getShoes({}, page, limit)
    .then((shoes) => {
      return res.status(200).json(shoes);
    })
    .catch((e) => {
      return res.status(400).send(e);
    });
};

// export method that retrieves a single application based on id from the application service
exports.getShoe = (req, res, next) => {
  let id = req.params.id;

  ShoeService.getShoe(id)
    .then((shoe) => {
      return res.status(200).json(shoe);
    })
    .catch((e) => {
      return res.status(400).send(e);
    });
};

// export a method that sends a new application to the application service
exports.createShoe = (req, res, next) => {
  let shoe = {
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    brand: req.body.brand,
  };
  ShoeService.createShoe(shoe)
    .then((createdShoe) => {
      return res.status(201).json(createdShoe);
    })
    .catch((e) => {
      return res.status(400).send(e);
    });
};

// export a method that sends new information with id to the application service
exports.updateShoe = (req, res, next) => {
  let shoe = {
    _id: req.body._id ? req.body._id : null,
    title: req.body.title ? req.body.title : null,
    description: req.body.description ? req.body.description : null,
    price: req.body.price ? req.body.price : null,
    brand: req.body.brand ? req.body.brand : null
  };
  ShoeService.updateShoe(shoe)
    .then((updatedShoe) => {
      return res.status(200).json(updatedShoe)
    })
    .catch((e) => {
      return res.status(400).send(e);
    });
};

// export a method that send a application for removal to the application service
exports.removeShoe = (req, res, next) => {
  let id = req.params.id;

  ShoeService.deleteShoe(id)
    .then((shoe) => {
      return res.status(204).json(shoe)
    })
    .catch((e) => {
      return res.status(400).send(e);
    });


};
