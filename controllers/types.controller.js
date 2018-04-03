// dependencies
const promise = require('bluebird');
const typeService = require('../services/types.service');

// variables
_this = this;

// export method that retrieves the types from the type service
exports.getTypes = (req, res, next) => {
  let page = req.query.page ? req.query.page : 1;
  let limit = req.query.limit ? req.query.limit : 10;

  promise.all([typeService.getTypes({}, page, limit), typeService.getCount()])
    .then((results) => {
      console.log(results);
      return res.status(200).format({
        html: function () {
          res.render('types/index.ejs', {
            types: results[0].docs,
            current: page,
            pages: Math.ceil(results[1] / limit),
            user: req.user ? req.user : null
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

// export method that retrieves a single type based on id from the type service
exports.getType = (req, res, next) => {
  let id = req.params.id;

  typeService.getType(id)
    .then((type) => {
      return res.format({
        html: function () {
          res.redirect('/types');
        },
        json: function () {
          res.status(200).json(type);
        }
      })
    })
    .catch((e) => {
      return res.status(400).send(e);
    });
};

// export a method that sends a new type to the type service
exports.createType = (req, res, next) => {
  let type = {
    title: req.body.title
  };
  typeService.createType(type)
    .then((createdType) => {
      return res.status(201).format({
        html: function () {
          res.redirect('/types');
        },
        json: function () {
          res.json(createdType);
        }
      })
    })
    .catch((e) => {
      return res.status(400).send(e);
    });
};

// export a method that sends new information with id to the type service
exports.updateType = (req, res, next) => {
  let type = {
    _id: req.params.id ? req.params.id : null,
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

// export a method that send a type for removal to the type service
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
