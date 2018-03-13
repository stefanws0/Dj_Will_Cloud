// dependencies
let Type = require('../models/type.model');
const ObjectId = require('mongoose').Types.ObjectId;

// variables
_this = this;

// Retrieve Types from database
function getTypes(query, page, limit) {
  return new Promise((resolve, reject) => {
    let options = {
      page,
      limit
    };
    Type.paginate(query, options, (err, types) => {
      if (err) {
        reject(err);
      } else {
        resolve(types);
      }
    });
  });
}

// Retrieve specific Type based on id
function getType(id) {
  return new Promise((resolve, reject) => {
    Type.findOne({_id: id}, (err, type) => {
      if (err) {
        reject(err);
      } else {
        resolve(type);
      }
    });
  });
}

// Create a new Type and save it to the database
function createType(type) {
  return new Promise((resolve, reject) => {
    let newType = new Type({
      title: type.title
    });
    newType.save((err, type) => {
      if (err) {
        reject(err);
      }
      else { //If no errors, send it back to the client
        resolve(type);
      }
    });
  });
}

// Update new information to a certain Type based on id
function updateType(type) {
  return new Promise((resolve, reject) => {
    let id = type._id;

    Type.findOne({_id: new ObjectId(id)}, (err, retrievedType) => {
      if (err) {
        reject(err);
      } else {
        retrievedType.title = type.title;
        retrievedType.save((err, type) => {
          if (err) {
            reject(err);
          }
          else { //If no errors, send it back to the client
            resolve(type);
          }
        });
      }
    });
  });
}

// Delete a certain Type from the database based on id
function deleteType(id) {
  return new Promise((resolve, reject) => {
    Type.remove({_id: id}, (err, deletedType) => {
      if (err) {
        reject(err);
      } else {
        resolve(deletedType);
      }
    });
  });
}


//export all the functions
module.exports = {deleteType, updateType, getType, getTypes, createType};
