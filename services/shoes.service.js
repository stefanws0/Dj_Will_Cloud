// dependencies
let Shoe = require('../models/shoe.model');
const ObjectId = require('mongoose').Types.ObjectId;

// variables
_this = this;

// Retrieve shoes from database
function getShoes(query, page, limit) {
  return new Promise((resolve, reject) => {
    let options = {
      page,
      limit
    };
    Shoe.paginate(query, options, (err, shoes) => {
      if (err) {
        reject(err);
      } else {
        resolve(shoes);
      }
    });
  });
}

// Retrieve specific shoe based on id
function getShoe(id) {
  return new Promise((resolve, reject) => {
    Shoe.findOne({_id: id}, (err, shoe) => {
      if (err) {
        reject(err);
      } else {
        resolve(shoe);
      }
    });
  });
}

// Create a new shoe and save it to the database
function createShoe(shoe) {
  return new Promise((resolve, reject) => {
    let newShoe = new Shoe({
      title: shoe.title,
      description: shoe.description,
      price: shoe.price,
      brand: shoe.brand
    });
    newShoe.save((err, shoe) => {
      if (err) {
        reject(err);
      }
      else { //If no errors, send it back to the client
        resolve(shoe);
      }
    });
  });
}

// Update new information to a certain shoe based on id
function updateShoe(shoe) {
  return new Promise((resolve, reject) => {
    let id = shoe._id;

    Shoe.findOne({_id: new ObjectId(id)}, (err, retrievedShoe) => {
      if (err) {
        reject(err);
      } else {
        retrievedShoe.title = shoe.title;
        retrievedShoe.description = shoe.description;
        retrievedShoe.price = shoe.price;
        retrievedShoe.brand = shoe.brand;
        retrievedShoe.save((err, shoe) => {
          if (err) {
            reject(err);
          }
          else { //If no errors, send it back to the client
            resolve(shoe);
          }
        });
      }
    });
  });
}

// Delete a certain shoe from the database based on id
function deleteShoe(id) {
  return new Promise((resolve, reject) => {
    Shoe.remove({_id: id}, (err, deletedShoe) => {
      if (err) {
        reject(err);
      } else {
        resolve(deletedShoe);
      }
    });
  });
}


//export all the functions
module.exports = {deleteShoe, updateShoe, getShoe, getShoes, createShoe};
