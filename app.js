require('dotenv').config();

const express = require('express'),
  app         = express(),
  ejs         = require('ejs'),
  mongoose    = require('mongoose');

// connect to database
mongoose.connect('mongodb://localhost:27017/playground_app', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

// SCHEMA SETUP
let playgroundSchema = new mongoose.Schema({
  name: String,
  image: String
});

let Playground = mongoose.model('Playground', playgroundSchema);

// Playground.create({ 
//   name: 'Park Two',
//   image: 'https://via.placeholder.com/150'
// }, function(err, playground){
//   if(err) {
//      console.log("Error: " + err);
//   } else {
//     console.log("New playground has been created:");
//     console.log(playground);
//   }
// });

app.get('/', function(req, res) {
    res.render('landing');
});

app.get('/playgrounds', function(req, res) {
    // get all playgrounds from DB
    Playground.find({}, function(err, allPlaygrounds){
      if(err){
        console.log("Error: " + err);
      } else {
        res.render('playgrounds', { playgrounds: allPlaygrounds });
      };
    });
});

app.post('/playgrounds', function(req, res) {
    // get data from form
    var newPlayground = { name: req.body.playgroundName, image: req.body.playgroundImg }
    // create new playground and save to DB
    Playground.create(newPlayground, function(err, addPlayground) {
      if(err) {
        console.log('Error: ' + err);
      } else {
        // redirect to playgrounds
        res.redirect('/playgrounds');
      };
    });
});

app.get('/playgrounds/new', function(req, res) {
    res.render('new.ejs');
});

app.listen(process.env.PORT, function() {
    console.log('Server listening on PORT ' + process.env.PORT + '.');
});