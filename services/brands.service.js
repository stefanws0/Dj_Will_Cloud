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
    if(limit === 0){
      Brand.find((err, brands) => {
        if (err) {
          reject(err);
        } else {
          resolve(brands);
        }
      })
    }else {
      Brand.paginate(query, options, (err, brands) => {
        if (err) {
          reject(err);
        } else {
          resolve(brands);
        }
      });
    }
  });
}

// Retrieve specific Brand based on id
function getBrand(id) {
  return new Promise((resolve, reject) => {
    Brand.findOne({_id: id}, (err, brand) => {
      if (err) {
        reject(err);
      } else {
        resolve(brand);
      }
    });
  });
}

// Create a new Brand and save it to the database
function createBrand(brand) {
  return new Promise((resolve, reject) => {
    let newBrand = new brand({
      title: brand.title,
      description: brand.description,
    });
    newBrand.save((err, brand) => {
      if (err) {
        reject(err);
      }
      else { //If no errors, send it back to the client
        resolve(brand);
      }
    });
  });
}

// Update new information to a certain Brand based on id
function updateBrand(brand) {
  return new Promise((resolve, reject) => {
    let id = brand._id;

    Brand.findOne({_id: new ObjectId(id)}, (err, retrievedBrand) => {
      if (err) {
        reject(err);
      } else {
        retrievedBrand.title = brand.title;
        retrievedBrand.description = brand.description;
        retrievedBrand.save((err, brand) => {
          if (err) {
            reject(err);
          }
          else { //If no errors, send it back to the client
            resolve(brand);
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
