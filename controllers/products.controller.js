// dependencies
const promise = require('bluebird');
const productService = require('../services/products.service');
const brandService = require('../services/brands.service');
const typeService = require('../services/types.service');

// variables
_this = this;

// export method that retrieves the applications from the application service
exports.getProducts = (req, res, next) => {
  let page = req.query.page ? req.query.page : 1;
  let limit = req.query.limit ? req.query.limit : 10;

  promise.all([productService.getProducts({}, page, limit), productService.getCount(), brandService.getBrands({}, 0, 0), typeService.getTypes({}, 0, 0)])
    .then((results) => {
      return res.status(200).format({
        html: function () {
          res.render('products/index.ejs', {
            products: results[0].docs, // get the user out of session and pass to template
            current: page,
            pages: Math.ceil(results[1] / limit),
            brands: results[2],
            types: results[3],
            user: req.user
          });
        },
        json: function () {
          res.json(results[0]);
        }
      })
    })
    .catch((e) => {
      console.log(e);
      return res.status(400).send(e);
    });
};

// export method that retrieves a single application based on id from the application service
exports.getProduct = (req, res, next) => {
  let id = req.params.id;

  promise.all([productService.getProduct(id), brandService.getBrands({}, 0, 0), typeService.getTypes({}, 0, 0)])
    .then((results) => {
      return res.format({
        html: function () {
          if(req.user.role === 1) {
            res.status(200).render('products/edit.ejs', {
              product: results[0], // get the user out of session and pass to template
              brands: results[1],
              types: results[2]
            });
          } else {
            res.status(200).render('products/details.ejs', {
              product: results[0]
            })
          }
        },
        json: function () {
          res.json(results[0]);
        }
      })
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
      return res.status(201).format({
        html: function () {
          res.redirect('/products?page=1');
        },
        json: function () {
          res.json(createdProduct);
        }
      })
    })
    .catch((e) => {
      return res.status(400).send(e);
    });
};

// export a method that sends new information with id to the application service
exports.updateProduct = (req, res, next) => {
  let product = {
    _id: req.params.id ? req.params.id : null,
    title: req.body.title ? req.body.title : null,
    description: req.body.description ? req.body.description : null,
    price: req.body.price ? req.body.price : null,
    brand: req.body.brand ? req.body.brand : null,
    type: req.body.type ? req.body.type : null
  };
  console.log(product);

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
