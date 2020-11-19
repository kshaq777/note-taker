// Boilerplate for express server 
const { request } = require("express");
var express = require("express");
var path = require("path");
var fs = require("fs");


var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));

// Starts the server to begin listening
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });


// Init array variables
var notes = JSON.parse(fs.readFileSync(path.join(__dirname, "/db/db.json")));
console.log(notes);

// Basic route that sends the user first to the AJAX Page
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
  });
  
// Note maker
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// Displays all notes
app.get("/api/notes", function(req, res) {
    return res.json(notes);
});

// Default redirect to index.html 
app.get('/*',function (req, res) {
    res.redirect('/');
});


// Create New Tables

app.post("/api/notes", function(req, res) {

    var newNote = req.body;
    newNote.id = notes.length;

    console.log(newNote);
    
    notes.push(newNote);

    res.json(newNote);

    console.log(notes);

    fs.writeFileSync(path.join(__dirname, "/db/db.json"), JSON.stringify(notes), (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log("Successfully wrote to db.JSON");
        }
      });
    
})

// Delete function
app.delete("/api/delete/:id", function(req, res) {

    // Get the right object you want to delete
    var del = req.params.id;
    parseInt(del);
    console.log(del);

    // Delete it
    notes.splice(del, 1);

    // Reset the IDs based on the deletion
    for (let i=0; i < notes.length; i++) {
        notes[i].id = i;
    }

    
    fs.writeFileSync(path.join(__dirname, "/db/db.json"), JSON.stringify(notes), (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log("Successfully wrote to db.JSON");
        }
      });

})
