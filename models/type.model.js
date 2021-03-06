// dependencies
const mongoose = require('mongoose');
const Promise = require('bluebird');
const mongoosePaginate = require('mongoose-paginate');
mongoose.Promise = Promise;
const Schema = mongoose.Schema;

// variables
let TypeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 25
  },
});

// set schema as schema in the database for Application
TypeSchema.plugin(mongoosePaginate);
const Type = mongoose.model('Type', TypeSchema);

module.exports = Type;
