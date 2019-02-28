var express = require("express");
var router = express.Router();
var Article = require("../models/article");
var Comment = require("../models/comment");

router.get("/", function (req, res) {
    // Get all articles from DB
    Article.find({}, function (err, allArticles) {
        if (err) {
            console.log(err);
        } else {
            res.render("news/index", { articles: allArticles });
        }
    });
});

//CREATE - add new article to DB
router.post("/", isLoggedIn, function (req, res) {
    // get data from form and add to article array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author ={
        id: req.user._id,
        username: req.user.username
    }
    var newArticle = { name: name, image: image, description: desc, author:author}
    // Create a new article and save to DB
    Article.create(newArticle, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            //redirect back to articles page
            console.log(newlyCreated);
            res.redirect("/news");
        }
    });
});

//NEW - show form to create new article
router.get("/new", isLoggedIn, function (req, res) {
    res.render("news/new");
});

// SHOW - shows more info about one article
router.get("/:id", function (req, res) {
    //find the article with provided ID
    Article.findById(req.params.id).populate("comments").exec(function (err, foundArticle) {
        if (err) {
            console.log(err);
        } else {

            //render show template with that article
            res.render("news/show", { article: foundArticle });
        }
    });
});

//Edit Campground Route
router.get("/:id/edit", function(req,res){
    Article.findById(req.params.id, function (err, foundArticle) {
        if (err) {
            res.redirect("/news")
        } else {
            res.render("news/edit", { article: foundArticle });
        }
    });
});
//Update Campground Route
router.put("/:id", function(req,res){
    //find and update the correct campground
    Article.findByIdAndUpdate(req.params.id, req.body.article, function(err,updatedArticle){
        if(err){
            res.redirect("/news")
        }else{
            //redirect somewhere (show page)
            res.redirect("/news/" +req.params.id)
        }
    });
    
});


// Destroy News Route
// router.delete("/:id", function(req,res){

//     res.send("You are trying to delete something");
// })


//middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
