process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Type = require('../models/type.model');
let Brand = require('../models/brand.model');
let typeService = require('../services/types.service');

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const app = require('../app');
const request = require('supertest');

const userCredentials = {
  email: 'test@hotmail.com',
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

describe('Types', () => {
  beforeEach((done) => {
    Type.remove({}, (err) => {
      done();
    });
  });
  describe('/GET type', function (done) {
    it('should return a 200 response and an object with no types if the user is logged in', function (done) {
      authenticatedUser.get('/types')
        .set('Accept', 'application/json')
        .end(function (err, res) {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.docs.length.should.be.eql(0);
          done();
        });
    });
    it('should return a 200 response and html if the user is logged in', function (done) {
      authenticatedUser.get('/types')
        .set('Accept', 'text/html')
        .end(function (err, res) {
          res.should.have.status(200);
          res.text.should.be.a("string");
          done();
        });
    });
    it('should return a 302 response and redirect to login if the user is logged in', function (done) {
      chai.request(app).get('/types').redirects(0)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          res.should.have.status(302);
          done();
        });
    });
  });

  describe('/POST type', () => {
    it('it should not POST a type without the title field', (done) => {
      let type = {};
      authenticatedUser.post('/types')
        .set('Accept', 'application/json')
        .send(type)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('title');
          res.body.errors.title.should.have.property('kind').eql('required');
          done();
        });
    });
    it('it should not POST a type if the title field is smaller than 2', (done) => {
      let type = {
        title: "1"
      };
      authenticatedUser.post('/types')
        .set('Accept', 'application/json')
        .send(type)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('title');
          res.body.errors.title.should.have.property('kind').eql('minlength');
          done();
        });
    });
    it('it should not POST a type if the title field is bigger than 25', (done) => {
      let type = {
        title: "Title is bigger than 25 characters and that is not allowed"
      };
      authenticatedUser.post('/types')
        .set('Accept', 'application/json')
        .send(type)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('title');
          res.body.errors.title.should.have.property('kind').eql('maxlength');
          done();
        });
    });
    it('it should POST a type ', (done) => {
      let type = {
        title: "Test Type",
        description: "Test Type Description"
      };
      authenticatedUser.post('/types')
        .set('Accept', 'application/json')
        .send(type)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('title');
          done();
        });
    });
  });
  describe('/GET/:id type', () => {
    it('it should GET a type by the given id', (done) => {
      let type = new Type({
        title: "Test Type"
      });
      type.save((err, type) => {
        authenticatedUser.get('/types/' + type._id)
          .set('Accept', 'application/json')
          .end(function (err, res) {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('title');
            res.body.should.have.property('_id').eql(type.id);
            done();
          });
      });
    });
    it('it should GET a type by the given id and return html', (done) => {
      let type = new Type({
        title: "Test Type"
      });
      type.save((err, type) => {
        authenticatedUser.get('/types/' + type._id)
          .set('Accept', 'text/html')
          .end(function (err, res) {
            res.should.have.status(302);
            done();
          });
      });
    });
  });
  describe('/PUT/:id type', () => {
    it('it should UPDATE a type given the id', (done) => {
      let type = new Type({
        title: "Test Type"
      });
      type.save((err, type) => {
        authenticatedUser.put('/types/' + type._id)
          .set('Accept', 'application/json')
          .send({
            title: "Test Update Type"
          })
          .end(function (err, res) {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('title');
            res.body.should.have.property('title').eql("Test Update Type");
            res.body.should.have.property('_id').eql(type.id);
            done();
          });
      });
    });
    it('it should UPDATE a type given the id and return html', (done) => {
      let type = new Type({
        title: "Test Type"
      });
      type.save((err, type) => {
        authenticatedUser.put('/types/' + type._id)
          .set('Accept', 'text/html')
          .send({
            title: "Test Update Type"
          })
          .end(function (err, res) {
            res.should.have.status(200);
            res.text.should.be.a("string");
            done();
          });
      });
    });
  });
  describe('/DELETE/:id type', () => {
    it('it should DELETE a type given the id', (done) => {
      let type = new Type({
        title: "Test Type"
      });
      type.save((err, type) => {
        authenticatedUser.delete('/types/' + type.id)
          .set('Accept', 'application/json')
          .end(function (err, res) {
            res.should.have.status(204);
            res.body.should.be.a('object');
            res.should.have.property('ok').eql(true);
            done();
          });
      });
    });
    it('it should DELETE a type given the id and return html', (done) => {
      let type = new Type({
        title: "Test Type"
      });
      type.save((err, brand) => {
        authenticatedUser.delete('/types/' + type.id)
          .set('Accept', 'text/html')
          .end(function (err, res) {
            res.should.have.status(204);
            res.text.should.be.a("string");
            done();
          });
      });
    });
  });
});
