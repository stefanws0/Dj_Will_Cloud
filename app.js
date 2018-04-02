// dependencies
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const bluebird = require('bluebird');
const mongoose = require('mongoose');
const passport = require('passport');
const flash    = require('connect-flash');
const session = require('express-session');
const api = require('./routes/api.route');
let config = require('config');

const app = express();

// database connection
mongoose.Promise = bluebird;
let databaseURL = "mongodb://admin2:admin@ds151908.mlab.com:51908/retro-chic";
mongoose.connect(config.DBHost)
  .then(() => {
    console.log('Succesfully connected to the Database at URL: ' + databaseURL);
  })
  .catch(() => {
    console.log('Error connecting to the Database at URL: ' + databaseURL)
  });

require('./config/passport')(passport);

// header initialization
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// view engine setup
app.set('view engine', 'ejs');


if(config.util.getEnv('NODE_ENV') !== 'test') {
  //use morgan to log at command line
  app.use(logger('combined')); //'combined' outputs the Apache style LOGs
}else{
  app.use(logger('dev'));
}

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret : 'bigsecret',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// route setup
// require('./app/routes.js')(app, passport);
app.use('/', api);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
