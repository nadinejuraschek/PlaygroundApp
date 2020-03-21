const   express     = require('express');
        router      = express.Router({mergeParams: true}),
        multer      = require('multer'),
        cloudinary = require('cloudinary'),
        Playground  = require('../models/playground'),
        middleware  = require('../middleware/index');

// IMAGE UPLOAD
const storage = multer.diskStorage({
    filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
const imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: imageFilter});

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key:    process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_SECRET
});

// INDEX - show all playgrounds
router.get('/', function(req, res) {
    // get all playgrounds from DB
    const perPage = 12;
    const pageQuery = parseInt(req.query.page);
    const pageNum = pageQuery ? pageQuery : 1;
    Playground.find({}).skip((perPage * pageNum) - perPage).limit(perPage).exec(function(err, allPlaygrounds){
      Playground.count().exec(function(err, count) {
        if(err){
          console.log("Error: " + err);
        } else {
          res.render('playgrounds/index', { title: 'All Playgrounds', playgrounds: allPlaygrounds, current: pageNum, pages: Math.ceil(count / perPage) });
        };
      });
    });
});

// CREATE - add new playground to DB
router.post('/', middleware.isLoggedIn, upload.single('image'), function(req, res) {
// router.post('/', middleware.isLoggedIn, function(req, res) {
  // console.log(req.file.path);
  cloudinary.v2.uploader.upload(req.file.path, function(error, result) {
    // add cloudinary url for the image to the playground object under image property
    req.body.playground.image = result.secure_url;
    // add author to playground
    req.body.playground.author = {
     id: req.user._id,
     username: req.user.username
    }
    // create new playground and save to DB
    Playground.create(req.body.playground, function(err, playground) {
      if(err) {
        // console.log('Error: ' + err);
        req.flash('error', err.message);
        return res.redirect('back');
      } else {
        // redirect to playgrounds
        console.log('New Playground: ' + playground);
        res.redirect('/playgrounds/' + playground.id);
      };
    });
  });
});

// NEW - show form to add playground
router.get('/new', middleware.isLoggedIn, function(req, res) {
    res.render('playgrounds/new', { title: 'Add A Playground' });
});

// SHOW - displays more info about a specific playground
router.get('/:id', function(req, res) {
    // find playground with provided ID
    Playground.findById(req.params.id).populate('comments').exec(function(err, foundPlayground){
      if (err) console.log(err);
      res.render('playgrounds/show', { title: '<%= foundPlayground.name %>', playground: foundPlayground });
    });
    // render show temp with that playground
});

// EDIT 
router.get('/:id/edit', middleware.checkPlaygroundOwnership, function(req, res){
  Playground.findById(req.params.id, function(err, foundPlayground){
    if (err) {
      req.flash('error', 'Playground not found.');
      res.redirect('back');
    } else {
      res.render('playgrounds/edit', { title: 'Edit A Playground', playground: foundPlayground });
    };
  });
});

// UPDATE
router.put('/:id', middleware.checkPlaygroundOwnership, function(req, res){
  // find and update playground
  Playground.findByIdAndUpdate(req.params.id, req.body.playground, function(err, updatedPlayground){
    if(err){
      res.redirect('/playgrounds');
    } else {
      res.redirect('/playgrounds/' + req.params.id);
    }
  })
});

// DESTROY
router.delete('/:id', middleware.checkPlaygroundOwnership, function(req, res){
  Playground.findByIdAndRemove(req.params.id, function(err){
    if (err) {
      req.flash('error', 'Playground not found.');
      res.redirect('/playgrounds');
    } else {
      req.flash('success', 'Playground has been removed.');
      res.redirect('/playgrounds');
    }
  })
});

module.exports = router;