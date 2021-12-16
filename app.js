var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const db = require('./models');
const sequelize = db.sequelize;

var indexRouter = require('./routes/index');

var app = express();

sequelize
  .sync()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error;
  err.status = 404;
  err.message= err.message || "Sorry! We couldn't the page you were looking for.";
  next(err);
  });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  if ( err.status === 404 ) {
    res.status(404).render('page-not-found', {err});
  } else {
    console.error(err)
    err.message = err.message || "Sorry! There was an unexpected error on the server.";
    res.status(err.status || 500).render('error', {err});
  }
});

module.exports = app;
