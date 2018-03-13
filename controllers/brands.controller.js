// dependencies
const brandService = require('../services/brands.service');

// variables
_this = this;

// export method that retrieves the applications from the application service
exports.getBrands = (req, res, next) => {
  let page = req.query.page ? req.query.page : 1;
  let limit = req.query.limit ? req.query.limit : 10;

  brandService.getBrands({}, page, limit)
    .then((brands) => {
      return res.status(200).json(brands);
    })
    .catch((e) => {
      return res.status(400).send(e);
    });
};

// export method that retrieves a single application based on id from the application service
exports.getBrand = (req, res, next) => {
  let id = req.params.id;

  brandService.getBrand(id)
    .then((brand) => {
      return res.status(200).json(brand);
    })
    .catch((e) => {
      return res.status(400).send(e);
    });
};

// export a method that sends a new application to the application service
exports.createBrand = (req, res, next) => {
  let brand = {
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    brand: req.body.brand,
  };
  brandService.createBrand(brand)
    .then((createdBrand) => {
      return res.status(201).json(createdBrand);
    })
    .catch((e) => {
      return res.status(400).send(e);
    });
};

// export a method that sends new information with id to the application service
exports.updateBrand = (req, res, next) => {
  let brand = {
    _id: req.body._id ? req.body._id : null,
    title: req.body.title ? req.body.title : null,
    description: req.body.description ? req.body.description : null,
    price: req.body.price ? req.body.price : null,
    brand: req.body.brand ? req.body.brand : null
  };
  brandService.updateBrand(brand)
    .then((updatedBrand) => {
      return res.status(200).json(updatedBrand)
    })
    .catch((e) => {
      return res.status(400).send(e);
    });
};

// export a method that send a application for removal to the application service
exports.removeBrand = (req, res, next) => {
  let id = req.params.id;

  brandService.deleteBrand(id)
    .then((brand) => {
      return res.status(204).json(brand)
    })
    .catch((e) => {
      return res.status(400).send(e);
    });


};
