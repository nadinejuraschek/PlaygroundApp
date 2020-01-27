const   express     = require('express');
        router      = express.Router(),
        Playground  = require('../models/playground'),
        Comment     = require('../models/comment');

// comments new
router.get('/new', isLoggedIn, function(req, res){
    // look up playground with id
    Playground.findById(req.params.id, function(err, playground){
        if (err) {
            console.log("Error: " + err);
        } else {
            // console.log(playground);
            res.render('comments/new', {playground: playground})
        };
    });
});
// comments create
router.post('/', function(req, res){
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

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
      return next();
    };
    res.redirect('/login');
};

module.exports = router;