var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const session = require('express-session');
app.use(session({
  secret: 'fwdd',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

var livereload = require("livereload");
var connectLiveReload = require("connect-livereload");
const bodyParser = require('body-parser');
const db = require('./models/db');



const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
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
app.use('/users', usersRouter);

app.get('/', (req, res) => {
  res.render('index');
})

app.get('/homepage', (req, res) => {
  if (!req.session.user) {
  // User is not logged in, redirect to login page
    res.redirect('/');
  } else {
  // User is logged in, render the dashboard
    res.render('homepage', { user_name: req.session.user_name });
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if(err) {
    // Handle error
      console.log(err);
      res.send('Error occurred during logout');
    } else {
  // Redirect to login page after successful logout
      res.redirect('/');
    }
  });
});

app.post('/login', (req, res) => {
  let sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
  let query = db.query(sql, [req.body.username, req.body.password],
  (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
  // Login successful, set session and redirect to dashboard
      req.session.user = result[0];
      req.session.user_name = result[0].username;
      res.redirect('/homepage');
    } else {
// Login failed, respond with error message
      res.send('Login failed');
    }
});});

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
