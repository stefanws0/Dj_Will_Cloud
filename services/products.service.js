// dependencies
let Product = require('../models/product.model');
const ObjectId = require('mongoose').Types.ObjectId;

// variables
_this = this;

// Retrieve Products from database
function getProducts(query, page, limit) {
  return new Promise((resolve, reject) => {
    let options = {
      page,
      limit
    };
    Product.paginate(query, options, (err, products) => {
      if (err) {
        reject(err);
      } else {
        resolve(products);
      }
    });
  });
}

// Retrieve specific Product based on id
function getProduct(id) {
  return new Promise((resolve, reject) => {
    Product.findOne({_id: id}, (err, product) => {
      if (err) {
        reject(err);
      } else {
        resolve(product);
      }
    });
  });
}

// Create a new Product and save it to the database
function createProduct(product) {
  return new Promise((resolve, reject) => {
    let newProduct = new Product({
      title: product.title,
      description: product.description,
      price: product.price,
      brand: product.brand,
      type: product.type
    });
    newProduct.save((err, product) => {
      if (err) {
        reject(err);
      }
      else { //If no errors, send it back to the client
        resolve(product);
      }
    });
  });
}

// Update new information to a certain Product based on id
function updateProduct(product) {
  return new Promise((resolve, reject) => {
    let id = product._id;

    Product.findOne({_id: new ObjectId(id)}, (err, retrievedProduct) => {
      if (err) {
        reject(err);
      } else {
        retrievedProduct.title = product.title;
        retrievedProduct.description = product.description;
        retrievedProduct.price = product.price;
        retrievedProduct.brand = product.brand;
        retrievedProduct.type = product.type;
        retrievedProduct.save((err, product) => {
          if (err) {
            reject(err);
          }
          else { //If no errors, send it back to the client
            resolve(product);
          }
        });
      }
    });
  });
}

// Delete a certain Product from the database based on id
function deleteProduct(id) {
  return new Promise((resolve, reject) => {
    Product.remove({_id: id}, (err, deletedProduct) => {
      if (err) {
        reject(err);
      } else {
        resolve(deletedProduct);
      }
    });
  });
}

function getCount() {
  return new Promise((resolve, reject) => {
    Product.count((err, count) => {
      if(err) {
        reject(err);
      } else {
        resolve(count);
      }
    })
  });
}


//export all the functions
module.exports = {deleteProduct, updateProduct, getProduct, getProducts, createProduct, getCount};
