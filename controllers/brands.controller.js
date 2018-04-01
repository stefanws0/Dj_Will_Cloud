// dependencies
const promise = require('bluebird');
const brandService = require('../services/brands.service');

// variables
_this = this;

// export method that retrieves the applications from the application service
exports.getBrands = (req, res, next) => {
  let page = req.query.page ? req.query.page : 1;
  let limit = req.query.limit ? req.query.limit : 10;

  promise.all([brandService.getBrands({}, page, limit), brandService.getCount()])
    .then((results) => {
      console.log(results);
      return res.status(200).format({
        html: function () {
          res.render('brands/index.ejs', {
            brands: results[0].docs,
            current: page,
            pages: Math.ceil(results[1] / limit),
            user: req.user
          });
        },
        json: function () {
          res.json(results[0]);
        }
      })
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
      return res.format({
        html: function () {
          res.status(200).render('brands/index.ejs', {
            brand: brand
          });
        },
        json: function () {
          res.status(200).json(brand);
        }
      })
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
  };
  brandService.createBrand(brand)
    .then((createdBrand) => {
      return res.status(201).format({
        html: function () {
          res.redirect('/brands');
        },
        json: function () {
          res.json(createdBrand);
        }
      })
    })
    .catch((e) => {
      console.log(e);
      return res.status(400).send(e);
    });
};

// export a method that sends new information with id to the application service
exports.updateBrand = (req, res, next) => {
  let brand = {
    _id: req.params.id ? req.params.id : null,
    title: req.body.title ? req.body.title : null,
    description: req.body.description ? req.body.description : null,
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
