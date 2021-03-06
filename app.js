require('dotenv').config();

const express         = require('express'),
      ejs             = require('ejs'),
      mongoose        = require('mongoose'),
      flash           = require('connect-flash'),
      app             = express(),
      passport        = require('passport'),
      LocalStrategy   = require('passport-local'),
      methodOverride  = require('method-override'),
      Playground      = require('./models/playground'),
      Comment         = require('./models/comment'),
      User            = require('./models/user'),
      seedDB          = require('./seeds');

// ROUTES
const indexRoutes     = require('./routes/index'),
      playRoutes      = require('./routes/playgrounds'),
      commentRoutes   = require('./routes/comments');

// DATABASE
mongoose.connect(
  process.env.MONGO_ATLAS, {
  // || 'mongodb://localhost:27017/playground_app', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true
});

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

// seedDB();

// MOMENT
app.locals.moment = require('moment');

// PASSPORT CONFIG
app.use(require('express-session')({
  secret: process.env.APP_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

// SERVER
app.use('/', indexRoutes);
app.use('/playgrounds', playRoutes);
app.use('/playgrounds/:id/comments', commentRoutes);

app.listen(process.env.PORT, function() {
    console.log('Server listening on PORT ' + process.env.PORT + '.');
});