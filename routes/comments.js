const   express     = require('express'),
        router      = express.Router({mergeParams: true}),
        Playground  = require('../models/playground'),
        Comment     = require('../models/comment');

// comments new
router.get('/new', isLoggedIn, function(req, res){
    // look up playground with id
    Playground.findById(req.params.id, function(err, playground){
      if (err) {
        console.log("Error: " + err);
      } else {
        // console.log(req.params.id);
        // console.log(playground);
        res.render('comments/new', { playground: playground });
      };
    });
});
// comments create
router.post('/', isLoggedIn, function(req, res){
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
            // add username and id
            // console.log(req.user.username);
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            // save comment
            comment.save();
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