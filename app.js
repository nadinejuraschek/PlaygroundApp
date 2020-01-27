require('dotenv').config();

const express       = require('express'),
      app           = express(),
      ejs           = require('ejs'),
      mongoose      = require('mongoose'),
      passport      = require('passport'),
      LocalStrategy = require('passport-local'),
      Playground    = require('./models/playground'),
      Comment       = require('./models/comment'),
      User          = require('./models/user'),
      seedDB        = require('./seeds');

// connect to database
mongoose.connect('mongodb://localhost:27017/playground_app', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

seedDB();

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
  next();
})

// CREATE -- add new campground to DB
app.get('/', function(req, res) {
    res.render('landing');
});

app.get('/playgrounds', function(req, res) {
    let currentUser = req.user;
    console.log(currentUser);
    // get all playgrounds from DB
    Playground.find({}, function(err, allPlaygrounds){
      if(err){
        console.log("Error: " + err);
      } else {
        res.render('playgrounds/index', { playgrounds: allPlaygrounds, currentUser: currentUser });
      };
    });
});

// NEW - show form to add playground
app.post('/playgrounds', function(req, res) {
    // get data from form
    let newPlayground = { name: req.body.playgroundName, image: req.body.playgroundImg, description: req.body.description };
    // create new playground and save to DB
    Playground.create(newPlayground, function(err, addPlayground) {
      if(err) {
        console.log('Error: ' + err);
      } else {
        // redirect to playgrounds
        res.redirect('/index');
      };
    });
});
app.get('/playgrounds/new', isLoggedIn, function(req, res) {
    res.render('playgrounds/new.ejs');
});

// SHOW - displays more info about a specific playground
app.get('/playgrounds/:id', function(req, res) {
    // find playground with provided ID
    Playground.findById(req.params.id).populate('comments').exec(function(err, foundPlayground){
      if (err) console.log(err);
      res.render('playgrounds/show', { playground: foundPlayground });
    });
    // render show temp with that playground
});

// COMMENTS
app.post('/playgrounds/:id/comments', function(req, res){
  // find playground by id
  Playground.findById(req.params.id, function(err, playground){
    if (err) {
      console.log("Error: " + err);
      res.redirect('/playgrounds');
    } else {
      Comment.create(req.body.comment, function(err, comment){
        if (err) {
          console.log("Error: " + err);
        } else {
          playground.comments.push(comment);
          playground.save();
          res.redirect('/playgrounds/' + playground._id);
        };
      });
    };
  });
});
app.get('/playgrounds/:id/comments/new', isLoggedIn, function(req, res){
  // look up playground with id
  Playground.findById(req.params.id, function(err, playground){
    if (err) {
      console.log("Error: " + err);
    } else {
      // console.log(playground);
      res.render('comments/new', {playground: playground})
    };
  });
  // create new comment

  // connect new comment

  // redirect playground show page
});

/**********************************************
 AUTH ROUTES
**********************************************/
// show signup form
app.get('/register', function(req, res){
  res.render('register');
})
// handle sign up logic
app.post('/register', function(req, res){
  const newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return res.render('register');
    }
    passport.authenticate('local')(req, res, function(){
      res.redirect('/playgrounds');
    });
  });
});
// show login form
app.get('/login', function(req, res){
  res.render('login');
});
// handle login logic
app.post('/login', passport.authenticate('local', 
  { 
    successRedirect: '/playgrounds', 
    failureRedirect: '/login'
  }), function(req, res){
});
// logout route
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  };
  res.redirect('/login');
};

app.listen(process.env.PORT, function() {
    console.log('Server listening on PORT ' + process.env.PORT + '.');
});