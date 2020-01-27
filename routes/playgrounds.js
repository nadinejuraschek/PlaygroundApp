const   express     = require('express');
        router      = express.Router({mergeParams: true}),
        Playground  = require('../models/playground');

// INDEX - show all playgrounds
router.get('/', function(req, res) {
    // get all playgrounds from DB
    Playground.find({}, function(err, allPlaygrounds){
      if(err){
        console.log("Error: " + err);
      } else {
        res.render('playgrounds/index', { playgrounds: allPlaygrounds });
      };
    });
});

// CREATE - add new playground to DB
router.post('/', function(req, res) {
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
// NEW - show form to add playground
router.get('/new', isLoggedIn, function(req, res) {
    res.render('playgrounds/new.ejs');
});

// SHOW - displays more info about a specific playground
router.get('/:id', function(req, res) {
    // find playground with provided ID
    Playground.findById(req.params.id).populate('comments').exec(function(err, foundPlayground){
      if (err) console.log(err);
      res.render('playgrounds/show', { playground: foundPlayground });
    });
    // render show temp with that playground
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
      return next();
    };
    res.redirect('/login');
};

module.exports = router;