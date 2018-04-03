process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Product = require('../models/product.model');
let Type = require('../models/type.model');
let Brand = require('../models/brand.model');
let productService = require('../services/products.service');

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

describe('Products', () => {
  beforeEach((done) => {
    Product.remove({}, (err) => {
      done();
    });
  });
  describe('/GET product', function (done) {
    it('should return a 200 response and an object with no products if the user is logged in', function (done) {
      authenticatedUser.get('/products')
        .set('Accept', 'application/json')
        .end(function (err, res) {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.docs.length.should.be.eql(0);
          done();
        });
    });
    it('should return a 200 response and html if the user is logged in', function (done) {
      authenticatedUser.get('/products')
        .set('Accept', 'text/html')
        .end(function (err, res) {
          res.should.have.status(200);
          res.text.should.be.a("string");
          done();
        });
    });
    it('should return a 302 response and redirect to login if the user is logged in', function (done) {
      chai.request(app).get('/products').redirects(0)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          res.should.have.status(302);
          done();
        });
    });
  });
  describe('/POST product', () => {
    it('it should not POST a product without the title field', (done) => {
      let product = {
        description: "Test Product Description",
        price: 1954,
        type: type,
        brand: brand
      };
      authenticatedUser.post('/products')
        .set('Accept', 'application/json')
        .send(product)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('title');
          res.body.errors.title.should.have.property('kind').eql('required');
          done();
        });
    });
    it('it should not POST a product if the title field is smaller than 5', (done) => {
      let product = {
        title: "1234",
        description: "Test Product Description",
        price: 1954,
        type: type,
        brand: brand
      };
      authenticatedUser.post('/products')
        .set('Accept', 'application/json')
        .send(product)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('title');
          res.body.errors.title.should.have.property('kind').eql('minlength');
          done();
        });
    });
    it('it should not POST a product if the title field is bigger than 25', (done) => {
      let product = {
        title: "Title is bigger than 25 characters and that is not allowed",
        description: "Test Product Description",
        price: 1954,
        type: type,
        brand: brand
      };
      authenticatedUser.post('/products')
        .set('Accept', 'application/json')
        .send(product)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('title');
          res.body.errors.title.should.have.property('kind').eql('maxlength');
          done();
        });
    });
    it('it should not POST a product if the description field is smaller than 5', (done) => {
      let product = {
        title: "Test Product",
        description: "1234",
        price: 1954,
        type: type,
        brand: brand
      };
      authenticatedUser.post('/products')
        .set('Accept', 'application/json')
        .send(product)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('description');
          res.body.errors.description.should.have.property('kind').eql('minlength');
          done();
        });
    });
    it('it should not POST a product if the description field is bigger than 100', (done) => {
      let product = {
        title: "Test Product",
        description: "Test Product DescriptionTest Product DescriptionTest Product DescriptionTest Product DescriptionTeTest Product DescriptionTest Product DescriptionTest Product DescriptionTest Product DescriptionTest Product DescriptionTest Product DescriptionTest Product Descriptionst Product DescriptionTest Product DescriptionTest Product DescriptionTest Product DescriptionTest Product DescriptionTest Product Description",
        price: 1954,
        type: type,
        brand: brand
      };
      authenticatedUser.post('/products')
        .set('Accept', 'application/json')
        .send(product)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('description');
          res.body.errors.description.should.have.property('kind').eql('maxlength');
          done();
        });
    });
    it('it should not POST a product without the price field', (done) => {
      let product = {
        title: "Test Product",
        description: "Test Product Description",
        type: type,
        brand: brand
      };
      authenticatedUser.post('/products')
        .set('Accept', 'application/json')
        .send(product)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('price');
          res.body.errors.price.should.have.property('kind').eql('required');
          done();
        });
    });
    it('it should not POST a product if the price field count is lower than 0', (done) => {
      let product = {
        title: "Test Product",
        description: "Test Product Description",
        type: type,
        price: -1,
        brand: brand
      };
      authenticatedUser.post('/products')
        .set('Accept', 'application/json')
        .send(product)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('price');
          res.body.errors.price.should.have.property('kind').eql('min');
          done();
        });
    });
    it('it should not POST a product if the price field count is higher than 25000', (done) => {
      let product = {
        title: "Test Product",
        description: "Test Product Description",
        type: type,
        price: 25001,
        brand: brand
      };
      authenticatedUser.post('/products')
        .set('Accept', 'application/json')
        .send(product)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('price');
          res.body.errors.price.should.have.property('kind').eql('max');
          done();
        });
    });
    it('it should not POST a product if the price field', (done) => {
      let product = {
        title: "Test Product",
        description: "Test Product Description",
        type: type,
        price: 25001,
        brand: brand
      };
      authenticatedUser.post('/products')
        .set('Accept', 'application/json')
        .send(product)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('price');
          res.body.errors.price.should.have.property('kind').eql('max');
          done();
        });
    });
    it('it should not POST a product without the type field', (done) => {
      let product = {
        title: "Test Product",
        description: "Test Product Description",
        price: 1954,
        brand: brand
      };
      authenticatedUser.post('/products')
        .set('Accept', 'application/json')
        .send(product)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('type');
          res.body.errors.type.should.have.property('kind').eql('required');
          done();
        });
    });
    it('it should not POST a product without the brand field', (done) => {
      let product = {
        title: "Test Product",
        description: "Test Product Description",
        price: 1954,
        type: type
      };
      authenticatedUser.post('/products')
        .set('Accept', 'application/json')
        .send(product)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('brand');
          res.body.errors.brand.should.have.property('kind').eql('required');
          done();
        });
    });
    it('it should POST a product ', (done) => {
      let product = {
        title: "Test Product",
        description: "Test Product Description",
        price: 1954,
        type: type,
        brand: brand
      };
      authenticatedUser.post('/products')
        .set('Accept', 'application/json')
        .send(product)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('title');
          res.body.should.have.property('description');
          res.body.should.have.property('price');
          res.body.should.have.property('type');
          res.body.should.have.property('brand');
          done();
        });
    });
    it('it should POST a product and return html', (done) => {
      let product = {
        title: "Test Product",
        description: "Test Product Description",
        price: 1954,
        type: type,
        brand: brand
      };
      authenticatedUser.post('/products')
        .set('Accept', 'text/html')
        .send(product)
        .end((err, res) => {
          res.should.have.status(302);
          done();
        });
    });
  });
  describe('/GET/:id product', () => {
    it('it should GET a product by the given id', (done) => {
      let product = new Product({
        title: "Test Product",
        description: "Test Product Description",
        price: 1954,
        type: type,
        brand: brand });
      product.save((err, product) => {
        authenticatedUser.get('/products/' + product._id)
          .set('Accept', 'application/json')
          .end(function (err, res) {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('title');
            res.body.should.have.property('description');
            res.body.should.have.property('price');
            res.body.should.have.property('type');
            res.body.should.have.property('brand');
            res.body.should.have.property('_id').eql(product.id);
            done();
          });
      });
    });
    it('it should GET a product by the given id and return html', (done) => {
      let product = new Product({
        title: "Test Product",
        description: "Test Product Description",
        price: 1954,
        type: type,
        brand: brand });
      product.save((err, product) => {
        authenticatedUser.get('/products/' + product._id)
          .set('Accept', 'text/html')
          .end(function (err, res) {
            res.should.have.status(200);
            res.text.should.be.a("string");
            done();
          });
      });
    });
  });
  describe('/PUT/:id product', () => {
    it('it should UPDATE a product given the id', (done) => {
      let product = new Product({
      title: "Test Product",
      description: "Test Product Description",
      price: 1954,
      type: type,
      brand: brand });
      product.save((err, product) => {
        authenticatedUser.put('/products/' + product._id)
          .set('Accept', 'application/json')
          .send({
            title: "Test Update Product",
            description: "Test Product Description",
            price: 1954,
            type: type,
            brand: brand })
          .end(function (err, res) {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('title');
            res.body.should.have.property('description');
            res.body.should.have.property('price');
            res.body.should.have.property('type');
            res.body.should.have.property('brand');
            res.body.should.have.property('title').eql("Test Update Product");
            res.body.should.have.property('_id').eql(product.id);
            done();
          });
      });
    });
    it('it should UPDATE a product given the id and return html', (done) => {
      let product = new Product({
        title: "Test Product",
        description: "Test Product Description",
        price: 1954,
        type: type,
        brand: brand });
      product.save((err, product) => {
        authenticatedUser.put('/products/' + product._id)
          .set('Accept', 'text/html')
          .send({
            title: "Test Update Product",
            description: "Test Product Description",
            price: 1954,
            type: type,
            brand: brand })
          .end(function (err, res) {
            res.should.have.status(200);
            res.text.should.be.a("string");
            done();
          });
      });
    });
  });
  describe('/DELETE/:id product', () => {
    it('it should DELETE a product given the id', (done) => {
      let product = new Product({
        title: "Test Product",
        description: "Test Product Description",
        price: 1954,
        type: type,
        brand: brand });
      product.save((err, product) => {
        authenticatedUser.delete('/products/' + product.id)
          .set('Accept', 'application/json')
          .end(function (err, res) {
            res.should.have.status(204);
            res.body.should.be.a('object');
            res.should.have.property('ok').eql(true);
            done();
          });
      });
    });
    it('it should DELETE a product given the id and return html', (done) => {
      let product = new Product({
        title: "Test Product",
        description: "Test Product Description",
        price: 1954,
        type: type,
        brand: brand });
      product.save((err, product) => {
        authenticatedUser.delete('/products/' + product.id)
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
