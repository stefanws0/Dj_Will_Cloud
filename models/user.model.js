// dependencies
const mongoose = require('mongoose');
const Promise = require('bluebird');
const mongoosePaginate = require('mongoose-paginate');
mongoose.Promise = Promise;
const bcrypt = require('bcrypt-nodejs');

// variables
let userSchema = mongoose.Schema({
  local: {
    email: String,
    password: String,
  },
  facebook: {
    id: String,
    token: String,
    name: String,
    email: String
  },
  twitter: {
    id: String,
    token: String,
    displayName: String,
    username: String
  },
  google: {
    id: String,
    token: String,
    email: String,
    name: String
  },
  role: Number

});

// set schema as schema in the database for Application
userSchema.plugin(mongoosePaginate);

userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.local.password);
};
const User = mongoose.model('User', userSchema);

module.exports = User;
