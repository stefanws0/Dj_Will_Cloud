// dependencies
const mongoose = require('mongoose');
const Promise = require('bluebird');
const mongoosePaginate = require('mongoose-paginate');
mongoose.Promise = Promise;
const Schema = mongoose.Schema;

// variables
let ShoeSchema = new mongoose.Schema({
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
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    max: 5000
  },
  brand: { type: Schema.Types.ObjectId, ref: 'Brand' }
});



// set schema as schema in the database for Application
ShoeSchema.plugin(mongoosePaginate);
const Shoe = mongoose.model('Shoe', ShoeSchema);

module.exports = Shoe;
