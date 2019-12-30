require('dotenv').config();

const express = require('express');
const ejs = require('ejs');

const app = express();

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('landing');
});

app.get('/playgrounds', function(req, res) {
    var playgroundList = [
        { name: 'Park One',
          image: 'https://via.placeholder.com/150'
        },
        { name: 'Park Two',
          image: 'https://via.placeholder.com/150'
        },
        { name: 'Park Three',
          image: 'https://via.placeholder.com/150'
        }
    ];

    res.render('playgrounds', { playgrounds: playgroundList });
});

app.post('/playgrounds', function(req, res) {
    // get data from form

    // add to array
    playgroundList.push(newPlayground);
    // redirect to playgrounds
    res.redirect('/playgrounds');
});

app.listen(process.env.PORT, function() {
    console.log('Server listening on PORT ' + process.env.PORT + '.');
});