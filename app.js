require('dotenv').config();

const express     = require('express'),
      app         = express(),
      ejs         = require('ejs'),
      mongoose    = require('mongoose'),
      Playground  = require('./models/playground'),
      Comment     = require('./models/comment'),
      User        = require('./models/user'),
      seedDB      = require('./seeds');

// seedDB();
// connect to database
mongoose.connect('mongodb://localhost:27017/playground_app', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

// CREATE -- add new campground to DB
app.get('/', function(req, res) {
    res.render('landing');
});

app.get('/playgrounds', function(req, res) {
    // get all playgrounds from DB
    Playground.find({}, function(err, allPlaygrounds){
      if(err){
        console.log("Error: " + err);
      } else {
        res.render('playgrounds/index', { playgrounds: allPlaygrounds });
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
app.get('/playgrounds/new', function(req, res) {
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
app.get('/playgrounds/:id/comments/new', function(req, res){
  // find playground by id
  Playground.findById(req.params.id, function(err, playground){
    if (err) {
      console.log("Error: " + err);
    } else {
      // console.log(playground);
      res.render('comments/new', {playground: playground})
    };
  });
});
app.get('/playgrounds/:id/comments', function(req, res){

});

app.listen(process.env.PORT, function() {
    console.log('Server listening on PORT ' + process.env.PORT + '.');
});