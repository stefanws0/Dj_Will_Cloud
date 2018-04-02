process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Type = require('../models/type.model');
let Brand = require('../models/brand.model');
let brandService = require('../services/brands.service');

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
let type = new Type({
  title: "Test Title"
});
let brand = new Brand({
  title: "Test Brand",
  description: "Test Brand Description"
});

before(function (done) {
  authenticatedUser
    .post('/login')
    .send(userCredentials)
    .end(function (err, res) {
      res.should.have.status(302);
      done();
    });
});

describe('Brands', () => {
  beforeEach((done) => {
    Brand.remove({}, (err) => {
      done();
    });
  });
  describe('/GET brand', function (done) {
    it('should return a 200 response and an object with no brands if the user is logged in', function (done) {
      authenticatedUser.get('/brands')
        .set('Accept', 'application/json')
        .end(function (err, res) {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.docs.length.should.be.eql(0);
          done();
        });
    });
    it('should return a 200 response and html if the user is logged in', function (done) {
      authenticatedUser.get('/brands')
        .set('Accept', 'text/html')
        .end(function (err, res) {
          res.should.have.status(200);
          res.text.should.be.a("string");
          done();
        });
    });
    it('should return a 302 response and redirect to login if the user is logged in', function (done) {
      chai.request(app).get('/brands').redirects(0)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          res.should.have.status(302);
          done();
        });
    });
  });

  describe('/POST brand', () => {
    it('it should not POST a brand without the title field', (done) => {
      let brand = {
        description: "Test Brand Description"
      };
      authenticatedUser.post('/brands')
        .set('Accept', 'application/json')
        .send(brand)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('title');
          res.body.errors.title.should.have.property('kind').eql('required');
          done();
        });
    });
    it('it should not POST a brand if the title field is smaller than 5', (done) => {
      let brand = {
        title: "1234",
        description: "Test Brand Description"
      };
      authenticatedUser.post('/brands')
        .set('Accept', 'application/json')
        .send(brand)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('title');
          res.body.errors.title.should.have.property('kind').eql('minlength');
          done();
        });
    });
    it('it should not POST a brand if the title field is bigger than 25', (done) => {
      let brand = {
        title: "Title is bigger than 25 characters and that is not allowed",
        description: "Test Brand Description"
      };
      authenticatedUser.post('/brands')
        .set('Accept', 'application/json')
        .send(brand)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('title');
          res.body.errors.title.should.have.property('kind').eql('maxlength');
          done();
        });
    });
    it('it should not POST a brand if the description field is smaller than 5', (done) => {
      let brand = {
        title: "Test Brand",
        description: "1234"
      };
      authenticatedUser.post('/brands')
        .set('Accept', 'application/json')
        .send(brand)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('description');
          res.body.errors.description.should.have.property('kind').eql('minlength');
          done();
        });
    });
    it('it should not POST a brand if the description field is bigger than 100', (done) => {
      let brand = {
        title: "Test Brand",
        description: "Test Brand DescriptionTest Brand DescriptionTest Brand DescriptionTest Brand DescriptionTeTest Brand DescriptionTest Brand DescriptionTest Brand DescriptionTest Brand DescriptionTest Brand DescriptionTest Brand DescriptionTest Brand Descriptionst Brand DescriptionTest Brand DescriptionTest Brand DescriptionTest Brand DescriptionTest Brand DescriptionTest Brand Description"
      };
      authenticatedUser.post('/brands')
        .set('Accept', 'application/json')
        .send(brand)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('description');
          res.body.errors.description.should.have.property('kind').eql('maxlength');
          done();
        });
    });
    it('it should POST a brand ', (done) => {
      let brand = {
        title: "Test Brand",
        description: "Test Brand Description"
      };
      authenticatedUser.post('/brands')
        .set('Accept', 'application/json')
        .send(brand)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('title');
          res.body.should.have.property('description');
          done();
        });
    });
  });
  describe('/GET/:id brand', () => {
    it('it should GET a brand by the given id', (done) => {
      let brand = new Brand({
        title: "Test Brand",
        description: "Test Brand Description"
      });
      brand.save((err, brand) => {
        authenticatedUser.get('/brands/' + brand._id)
          .set('Accept', 'application/json')
          .end(function (err, res) {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('title');
            res.body.should.have.property('description');
            res.body.should.have.property('_id').eql(brand.id);
            done();
          });
      });
    });
    it('it should GET a brand by the given id and return html', (done) => {
      let brand = new Brand({
        title: "Test Brand",
        description: "Test Brand Description"
      });
      brand.save((err, brand) => {
        authenticatedUser.get('/brands/' + brand._id)
          .set('Accept', 'text/html')
          .end(function (err, res) {
            res.should.have.status(302);
            done();
          });
      });
    });
  });
  describe('/PUT/:id brand', () => {
    it('it should UPDATE a brand given the id', (done) => {
      let brand = new Brand({
        title: "Test Brand",
        description: "Test Brand Description"
      });
      brand.save((err, brand) => {
        authenticatedUser.put('/brands/' + brand._id)
          .set('Accept', 'application/json')
          .send({
            title: "Test Update Brand",
            description: "Test Brand Description"
          })
          .end(function (err, res) {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('title');
            res.body.should.have.property('description');
            res.body.should.have.property('title').eql("Test Update Brand");
            res.body.should.have.property('_id').eql(brand.id);
            done();
          });
      });
    });
    it('it should UPDATE a product given the id and return html', (done) => {
      let brand = new Brand({
        title: "Test Brand",
        description: "Test Brand Description"
      });
      brand.save((err, brand) => {
        authenticatedUser.put('/brands/' + brand._id)
          .set('Accept', 'text/html')
          .send({
            title: "Test Update Brand",
            description: "Test Brand Description"
          })
          .end(function (err, res) {
            res.should.have.status(200);
            res.text.should.be.a("string");
            done();
          });
      });
    });
  });
  describe('/DELETE/:id brand', () => {
    it('it should DELETE a brand given the id', (done) => {
      let brand = new Brand({
        title: "Test Brand",
        description: "Test Brand Description"
      });
      brand.save((err, brand) => {
        authenticatedUser.delete('/brands/' + brand.id)
          .set('Accept', 'application/json')
          .end(function (err, res) {
            res.should.have.status(204);
            res.body.should.be.a('object');
            res.should.have.property('ok').eql(true);
            done();
          });
      });
    });
    it('it should DELETE a brand given the id and return html', (done) => {
      let brand = new Brand({
        title: "Test Brand",
        description: "Test Brand Description"
      });
      brand.save((err, brand) => {
        authenticatedUser.delete('/brands/' + brand.id)
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
