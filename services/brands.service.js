// dependencies
let Brand = require('../models/brand.model');
const ObjectId = require('mongoose').Types.ObjectId;

// variables
_this = this;

// Retrieve Brands from database
function getBrands(query, page, limit) {
  return new Promise((resolve, reject) => {
    let options = {
      page,
      limit
    };
    Brand.paginate(query, options, (err, Brands) => {
      if (err) {
        reject(err);
      } else {
        resolve(Brands);
      }
    });
  });
}

// Retrieve specific Brand based on id
function getBrand(id) {
  return new Promise((resolve, reject) => {
    Brand.findOne({_id: id}, (err, Brand) => {
      if (err) {
        reject(err);
      } else {
        resolve(Brand);
      }
    });
  });
}

// Create a new Brand and save it to the database
function createBrand(Brand) {
  return new Promise((resolve, reject) => {
    let newBrand = new Brand({
      title: Brand.title,
      description: Brand.description,
      price: Brand.price,
      brand: Brand.brand
    });
    newBrand.save((err, Brand) => {
      if (err) {
        reject(err);
      }
      else { //If no errors, send it back to the client
        resolve(Brand);
      }
    });
  });
}

// Update new information to a certain Brand based on id
function updateBrand(Brand) {
  return new Promise((resolve, reject) => {
    let id = Brand._id;

    Brand.findOne({_id: new ObjectId(id)}, (err, retrievedBrand) => {
      if (err) {
        reject(err);
      } else {
        retrievedBrand.title = Brand.title;
        retrievedBrand.description = Brand.description;
        retrievedBrand.price = Brand.price;
        retrievedBrand.brand = Brand.brand;
        retrievedBrand.save((err, Brand) => {
          if (err) {
            reject(err);
          }
          else { //If no errors, send it back to the client
            resolve(Brand);
          }
        });
      }
    });
  });
}

// Delete a certain Brand from the database based on id
function deleteBrand(id) {
  return new Promise((resolve, reject) => {
    Brand.remove({_id: id}, (err, deletedBrand) => {
      if (err) {
        reject(err);
      } else {
        resolve(deletedBrand);
      }
    });
  });
}


//export all the functions
module.exports = {deleteBrand, updateBrand, getBrand, getBrands, createBrand};
