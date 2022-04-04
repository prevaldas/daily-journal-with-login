const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const _ = require('lodash');

const homeStartingContent = "Write your thoughts here everyday.";
const aboutContent = "My name is Evaldas and I am a web developer.";
const contactContent = "For any coments and sugestions please contact me here:";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect("mongodb+srv://admin-evaldas:zvirbliai0607@cluster0.0k5n1.mongodb.net/blogDB", {useNewUrlParser: true, useUnifiedTopology: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

// Logging in
app.get("/", function(req, res){
  res.render("signup");
});

app.post("/", function(req, res){
  res.redirect("/home");
})
// Logging out
app.post("/logout", function(req, res){
  res.render("signup");
})

app.get("/home", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

// home button direction to compose

app.post("/posting", function(require, respond){
  respond.redirect("/compose");
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err){
    if (!err){
      console.log("saved");
        res.redirect("/home");
    }
  });
});

app.post("/delete", function(req, res){
  checkedItemId = req.body.checkbox;

  Post.findByIdAndRemove(checkedItemId, function(err) {
    if (!err) {
      console.log("deleted");
      res.redirect("/home");
    }
  })
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started.");
});
