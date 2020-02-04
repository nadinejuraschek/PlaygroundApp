var mongoose = require("mongoose");
var Playground = require("./models/playground");
var Comment   = require("./models/comment");
 
var data = [
    {
        name: "Wildflower Meadow Park", 
        image: "https://images.pexels.com/photos/1134000/pexels-photo-1134000.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        description: "Fenced playground next to the Wildflower Meadow neighborhood. The small park includes three swings (one baby/toddler swing), multiple small play structures, and a slide. Mostly for children age 4 and up.",
        author: {
            username: "Peter"
        }
    },
    {
        name: "Magical Rainbow Park", 
        image: "https://images.unsplash.com/photo-1555851117-49167a4d285f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1867&q=80",
        description: "Grand park with lots of monkey bars and climbing equipment, slides and swings for older kids and toddlers, as well as a small sandbox. There are multiple benches for parents to sit nearby. A public restroom is also available.",
        author: {
            username: "HappyMama"
        }
    },
    {
        name: "Willow Creek Park", 
        image: "https://images.pexels.com/photos/133458/pexels-photo-133458.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        description: "Small park with a playstructure. No slides, swings, or sandpits. Good for ages 5+.",
        author: {
            username: "Monica"
        }
    }
]
 
function seedDB(){
   //Remove all playgrounds
   Playground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed playgrounds!");
        // Comment.remove({}, function(err) {
        //     if(err){
        //         console.log(err);
        //     }
        //     console.log("removed comments!");
             //add a few playgrounds
    //         data.forEach(function(seed){
    //             Playground.create(seed, function(err, playground){
    //                 if(err){
    //                     console.log(err)
    //                 } else {
    //                     console.log("added a playground");
    //                     //create a comment
    //                     Comment.create(
    //                         {
    //                             text: "Our favorite playground!",
    //                             author: {
    //                                 username: "Nora"
    //                             }
    //                         }, {
    //                             text: "I wish there were picnic tables.",
    //                             author: {
    //                                 username: "BenjaminS"
    //                             }
    //                         }, function(err, comment){
    //                             if(err){
    //                                 console.log(err);
    //                             } else {
    //                                 playground.comments.push(comment);
    //                                 playground.save();
    //                                 console.log("Created new comment");
    //                             }
    //                         });
    //                 }
    //             });
    //         });
    //     });
    }); 
}
 
module.exports = seedDB;