// dependencies
const mongoose = require('mongoose');
const Promise = require('bluebird');
const mongoosePaginate = require('mongoose-paginate');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');
mongoose.Promise = Promise;
const Schema = mongoose.Schema;

// variables
let UserSchema = new mongoose.Schema({
  username: {
    type: String,
    lowercase: true,
    required: [true, "can't be blank"],
    match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
    index: true
  },
  email: {
    type: String,
    lowercase: true,
    required: [true, "can't be blank"],
    match: [/\S+@\S+\.\S+/, 'is invalid'],
    index: true
  },
  bio: {
    type: Number,
    required: true,
    min: 0,
    max: 5000
  },
  image: {
    data: Buffer,
    contentType: String
  },
  hash: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  }
}, {timestamps: true});

// set schema as schema in the database for Application
UserSchema.plugin(mongoosePaginate);
UserSchema.plugin(uniqueValidator, {message: 'is already taken.'});

UserSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.validPassword = function(password) {
  let hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
