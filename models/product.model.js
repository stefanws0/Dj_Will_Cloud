// dependencies
const mongoose = require('mongoose');
const Promise = require('bluebird');
const mongoosePaginate = require('mongoose-paginate');
mongoose.Promise = Promise;
const Schema = mongoose.Schema;

// variables
let ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 25
  },
  description: {
    type: String,
    required: false,
    minlength: 10,
    maxlength: 100
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    max: 25000
  },
  type: { type: Schema.Types.ObjectId, ref: 'Type', required: true},
  brand: { type: Schema.Types.ObjectId, ref: 'Brand' }
});



// set schema as schema in the database for Application
ProductSchema.plugin(mongoosePaginate);
const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
