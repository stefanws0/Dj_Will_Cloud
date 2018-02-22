// dependencies
const mongoose = require('mongoose');
const Promise = require('bluebird');
const mongoosePaginate = require('mongoose-paginate');
mongoose.Promise = Promise;

// variables
let BrandSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 25
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 100
  }
});

// set schema as schema in the database for Application
BrandSchema.plugin(mongoosePaginate);
const Brand = mongoose.model('Shoe', BrandSchema);

module.exports = Brand;
