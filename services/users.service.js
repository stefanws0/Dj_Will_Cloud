// dependencies
let User = require('../models/user.model');
const ObjectId = require('mongoose').Types.ObjectId;

// variables
_this = this;

// Retrieve Types from database
function getUsers(query, page, limit) {
  return new Promise((resolve, reject) => {
    let options = {
      page,
      limit
    };
    User.paginate(query, options, (err, users) => {
      if (err) {
        reject(err);
      } else {
        resolve(users);
      }
    });
  });
}

// Retrieve specific Type based on id
function getUser(id) {
  return new Promise((resolve, reject) => {
    User.findOne({_id: id}, (err, user) => {
      if (err) {
        reject(err);
      } else {
        resolve(user);
      }
    });
  });
}

// Update new information to a certain Type based on id
function updateUser(user) {
  return new Promise((resolve, reject) => {
    console.log(user);
    let id = user._id;

    User.findOne({_id: new ObjectId(id)}, (err, retrievedUser) => {
      if (err) {
        reject(err);
      } else {
        retrievedUser.role = user.role;
        retrievedUser.save((err, user) => {
          if (err) {
            reject(err);
          }
          else { //If no errors, send it back to the client
            resolve(user);
          }
        });
      }
    });
  });
}

// Delete a certain Type from the database based on id
function deleteUser(id) {
  return new Promise((resolve, reject) => {
    User.remove({_id: id}, (err, deletedUser) => {
      if (err) {
        reject(err);
      } else {
        resolve(deletedUser);
      }
    });
  });
}


function getCount() {
  return new Promise((resolve, reject) => {
    User.count((err, count) => {
      if(err) {
        reject(err);
      } else {
        resolve(count);
      }
    })
  });
}
//export all the functions
module.exports = {deleteUser, updateUser, getUser, getUsers, getCount};
