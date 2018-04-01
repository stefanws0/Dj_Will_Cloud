// dependencies
const mongoose = require('mongoose');
const Promise = require('bluebird');
const mongoosePaginate = require('mongoose-paginate');
mongoose.Promise = Promise;

// variables
let TypeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 25
  },
});

TypeSchema.pre('remove', function(next) {
  this.model('Product').remove({ type: this._id }, next);
});

// set schema as schema in the database for Application
TypeSchema.plugin(mongoosePaginate);
const Type = mongoose.model('Type', TypeSchema);

module.exports = Type;
