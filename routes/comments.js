const   express     = require('express'),
        router      = express.Router({mergeParams: true}),
        Playground  = require('../models/playground'),
        Comment     = require('../models/comment'),
        middleware  = require('../middleware/index');

// NEW
router.get('/new', middleware.isLoggedIn, function(req, res){
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
// CREATE
router.post('/', middleware.isLoggedIn, function(req, res){
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
            // console.log(req.body.comment.text);
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

// EDIT
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res){
  Comment.findById(req.params.comment_id, function(err, foundComment){
    if (err) {
      res.redirect('back');
    } else {
      res.render('comments/edit', { playground_id: req.params.id, comment: foundComment });
    }
  });
});

// UPDATE
router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if (err) {
        res.redirect('back');
      } else {
        res.redirect('/playgrounds/' + req.params.id);
      }
    });
});

// DELETE
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if (err) {
      res.redirect('back');
    } else {
      res.redirect('/playgrounds/' + req.params.id);
    }
  });
});

module.exports = router;