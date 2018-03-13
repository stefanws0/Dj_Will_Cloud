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

// Create a new Type and save it to the database
function createUser(user) {
  return new Promise((resolve, reject) => {
    let newUser = new User({
      username: user.username,
      email: user.email,
      bio: user.bio,
      image: user.image
    });
    newUser.setPassword(user.password);
    newUser.save((err, user) => {
      if (err) {
        reject(err);
      }
      else { //If no errors, send it back to the client
        resolve(user);
      }
    });
  });
}

// Update new information to a certain Type based on id
function updateUser(user) {
  return new Promise((resolve, reject) => {
    let id = user._id;

    User.findOne({_id: new ObjectId(id)}, (err, retrievedUser) => {
      if (err) {
        reject(err);
      } else {
        retrievedUser.username = user.username;
        retrievedUser.email = user.email;
        retrievedUser.bio = user.bio;
        retrievedUser.image = user.image;
        if(!retrievedUser.validPassword(user.password)){
          retrievedUser.setPassword(user.password);
        }
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


//export all the functions
module.exports = {deleteUser, updateUser, getUser, getUsers, createUser};
