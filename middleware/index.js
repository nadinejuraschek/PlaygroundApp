const   Playground  = require('../models/playground'),
        comments    = require('../models/comment');

let middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    };
    req.flash('success', 'Please log in first.');
    res.redirect('/login');
};

middlewareObj.checkPlaygroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
      Playground.findById(req.params.id, function(err, foundPlayground){
        if (err){
          console.log(err);
        } else {
          if(foundPlayground.author.id.equals(req.user._id)) {
            next();
          } else {
            res.redirect('back');
          }
        }
      });
    } else {
      res.redirect('back');
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
      Comment.findById(req.params.comment_id, function(err, foundComment){
        if (err){
          console.log(err);
        } else {
          if(foundComment.author.id.equals(req.user._id)) {
            next();
          } else {
            res.redirect('back');
          }
        }
      });
    } else {
      res.redirect('back');
    }
};

module.exports = middlewareObj;