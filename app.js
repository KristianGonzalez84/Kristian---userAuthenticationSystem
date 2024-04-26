require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const passport = require('passport');

var db = require('./models');
// Synchronize the database and log the result
console.log('Synchronizing database...');
db.sequelize.sync({ force: false })
  .then(() => {
    console.log('Database synchronized successfully');
  })
  .catch(err => {
    console.error('Error synchronizing database:', err);
  });

var app = express();

app.use(session({
  secret: 'Secret',
  resave: false,
  saveUninitialized: false,
}));

// Add session logging middleware
app.use((req, res, next) => {
  console.log('Session ID:', req.sessionID);
  console.log('Session Data:', req.session);
  next();
});

app.use(passport.initialize());
app.use(passport.session());

// Import routers
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/users');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/', authRouter);
app.use('/users', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;