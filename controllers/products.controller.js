// dependencies
const productService = require('../services/products.service');

// variables
_this = this;

// export method that retrieves the applications from the application service
exports.getProducts = (req, res, next) => {
  let page = req.query.page ? req.query.page : 1;
  let limit = req.query.limit ? req.query.limit : 10;

  productService.getProducts({}, page, limit)
    .then((products) => {
      return res.status(200).json(products);
    })
    .catch((e) => {
      return res.status(400).send(e);
    });
};

// export method that retrieves a single application based on id from the application service
exports.getProduct = (req, res, next) => {
  let id = req.params.id;

  productService.getProduct(id)
    .then((product) => {
      return res.status(200).json(product);
    })
    .catch((e) => {
      return res.status(400).send(e);
    });
};

// export a method that sends a new application to the application service
exports.createProduct = (req, res, next) => {
  let product = {
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    brand: req.body.brand,
    type: req.body.type
  };
  productService.createProduct(product)
    .then((createdProduct) => {
      return res.status(201).json(createdProduct);
    })
    .catch((e) => {
      return res.status(400).send(e);
    });
};

// export a method that sends new information with id to the application service
exports.updateProduct = (req, res, next) => {
  let product = {
    _id: req.body._id ? req.body._id : null,
    title: req.body.title ? req.body.title : null,
    description: req.body.description ? req.body.description : null,
    price: req.body.price ? req.body.price : null,
    brand: req.body.brand ? req.body.brand : null,
    type: req.body.type ? req.body.type: null
  };
  productService.updateProduct(product)
    .then((updatedProduct) => {
      return res.status(200).json(updatedProduct)
    })
    .catch((e) => {
      return res.status(400).send(e);
    });
};

// export a method that send a application for removal to the application service
exports.removeProduct = (req, res, next) => {
  let id = req.params.id;

  productService.deleteProduct(id)
    .then((product) => {
      return res.status(204).json(product)
    })
    .catch((e) => {
      return res.status(400).send(e);
    });


};
