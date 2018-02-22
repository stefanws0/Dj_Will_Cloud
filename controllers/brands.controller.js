// dependencies
const BrandService = require('../services/Brands.service');

// variables
_this = this;

// export method that retrieves the applications from the application service
exports.getBrands = (req, res, next) => {
  let page = req.query.page ? req.query.page : 1;
  let limit = req.query.limit ? req.query.limit : 10;

  BrandService.getBrands({}, page, limit)
    .then((Brands) => {
      return res.status(200).json(Brands);
    })
    .catch((e) => {
      return res.status(400).send(e);
    });
};

// export method that retrieves a single application based on id from the application service
exports.getBrand = (req, res, next) => {
  let id = req.params.id;

  BrandService.getBrand(id)
    .then((Brand) => {
      return res.status(200).json(Brand);
    })
    .catch((e) => {
      return res.status(400).send(e);
    });
};

// export a method that sends a new application to the application service
exports.createBrand = (req, res, next) => {
  let Brand = {
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    brand: req.body.brand,
  };
  BrandService.createBrand(Brand)
    .then((createdBrand) => {
      return res.status(201).json(createdBrand);
    })
    .catch((e) => {
      return res.status(400).send(e);
    });
};

// export a method that sends new information with id to the application service
exports.updateBrand = (req, res, next) => {
  let Brand = {
    _id: req.body._id ? req.body._id : null,
    title: req.body.title ? req.body.title : null,
    description: req.body.description ? req.body.description : null,
    price: req.body.price ? req.body.price : null,
    brand: req.body.brand ? req.body.brand : null
  };
  BrandService.updateBrand(Brand)
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

  BrandService.deleteBrand(id)
    .then((Brand) => {
      return res.status(204).json(Brand)
    })
    .catch((e) => {
      return res.status(400).send(e);
    });


};
