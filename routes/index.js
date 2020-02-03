const   express     = require('express');
        router      = express.Router()
        passport    = require('passport'),
        User        = require('../models/user'),
        Playground  = require('../models/playground'),
        Comment     = require('../models/comment');

router.get('/', function(req, res) {
    res.render('landing', { title: 'Home' });
});

// AUTHENTICATION
// show signup form
router.get('/register', function(req, res){
  res.render('register', { title: 'Register' });
});
// handle sign up logic
router.post('/register', function(req, res){
    const newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function(err, user) {
      if (err) {
        console.log(err);
        return res.render('register', { title: 'Register' });
      }
      passport.authenticate('local')(req, res, function(){
        res.redirect('/playgrounds');
      });
    });
});
// show login form
router.get('/login', function(req, res){
    res.render('login', { title: 'Log In' });
});
// handle login logic
router.post('/login', passport.authenticate('local', 
    { 
      successRedirect: '/playgrounds', 
      failureRedirect: '/login'
    }), function(req, res){
});
// logout route
router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});
  
module.exports = router;