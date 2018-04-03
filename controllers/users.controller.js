// dependencies
const promise = require('bluebird');
const userService = require('../services/users.service');

// variables
_this = this;

// export method that retrieves the applications from the application service
exports.getUsers = (req, res, next) => {
  let page = req.query.page ? req.query.page : 1;
  let limit = req.query.limit ? req.query.limit : 10;

  promise.all([userService.getUsers({}, page, limit), userService.getCount()])
    .then((results) => {
      console.log(results);
      return res.status(200).format({
        html: function () {
          res.render('users/index.ejs', {
            users: results[0].docs,
            current: page,
            pages: Math.ceil(results[1] / limit),
            user: req.user ? req.user : null
          });
        },
        json: function () {
          res.status(200).json(results[0]);
        }
      })
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

// export a method that sends new information with id to the user service
exports.updateUser = (req, res, next) => {

  let id = req.params.id ? req.params.id : null;
  let role = req.body.role ? req.body.role : null;
  userService.getUser(id)
    .then((user) => {
      console.log(user);
      user.role = role;
      userService.updateUser(user)
        .then((updateUser) => {
          return res.status(200).json(updateUser)
        })
        .catch((e) => {
          return res.status(400).send(e);
        });
    });
};

// export a method that send a application for removal to the user service
exports.removeUser = (req, res, next) => {
  let id = req.params.id;

  userService.deleteUser(id)
    .then((user) => {
      return res.status(204).json(user)
    })
    .catch((e) => {
      return res.status(400).send(e);
    });


};
