process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('../models/user.model');
let userService = require('../services/users.service');

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const app = require('../app');
const request = require('supertest');

const userCredentials = {
  email: 'test2@hotmail.com',
  password: 'test'
};

chai.use(chaiHttp);
let authenticatedUser = request.agent(app);

before(function (done) {
  authenticatedUser
    .post('/login')
    .send(userCredentials)
    .end(function (err, res) {
      res.should.have.status(302);
      done();
    });
});

describe('Users', () => {
  describe('/GET user', function (done) {
    it('should return a 200 response and an object with no users if the user is logged in', function (done) {
      authenticatedUser.get('/users')
        .set('Accept', 'application/json')
        .end(function (err, res) {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
    it('should return a 200 response and html if the user is logged in', function (done) {
      authenticatedUser.get('/users')
        .set('Accept', 'text/html')
        .end(function (err, res) {
          res.should.have.status(200);
          res.text.should.be.a("string");
          done();
        });
    });
    it('should return a 302 response and redirect to login if the user is logged in', function (done) {
      chai.request(app).get('/users').redirects(0)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          res.should.have.status(302);
          done();
        });
    });
  });
  describe('/GET/:id user', () => {
    it('it should GET a user by the given id', (done) => {
      let user = new User({
        local: {
          email: "remind@hotmail.com",
          password: "Password"
        }
      });
      user.save((err, user) => {
        authenticatedUser.get('/users/' + user._id)
          .set('Accept', 'application/json')
          .end(function (err, res) {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.local.should.have.property('email');
            res.body.local.should.have.property('password');
            res.body.should.have.property('_id').eql(user.id);
            done();
          });
      });

    });
  });
  describe('/PUT/:id user', () => {
    it('it should UPDATE a user given the id', (done) => {
      let user = new User({
        local: {
          email: "remind@hotmail.com",
          password: "Password"
        },
        role: 0
      });
      user.save((err, user) => {
        authenticatedUser.put('/users/' + user._id)
          .set('Accept', 'application/json')
          .send({
            local: {
              email: "remind@hotmail.com",
              password: "Password"
            },
            role: 1
          })
          .end(function (err, res) {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.local.should.have.property('email');
            res.body.local.should.have.property('password');
            res.body.should.have.property('role');
            res.body.should.have.property('role').eql(1);
            res.body.should.have.property('_id').eql(user.id);
            done();
          });
      });
    });
  });
  describe('/DELETE/:id user', () => {
    it('it should DELETE a user given the id', (done) => {
      let user = new User({
        local: {
          email: "remind@hotmail.com",
          password: "Password"
        }
      });
      user.save((err, user) => {
        authenticatedUser.delete('/users/' + user.id)
          .set('Accept', 'application/json')
          .end(function (err, res) {
            res.should.have.status(204);
            res.body.should.be.a('object');
            res.should.have.property('ok').eql(true);
            done();
          });
      });
    });
  });
});
