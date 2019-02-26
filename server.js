const mongoose = require("mongoose");
const express = require("express");
const logger = require("morgan");
const axios = require("axios");
const cheerio = require("cheerio");


let db = require("./models");
let PORT = 3000;
let app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/test", { useNewUrlParser: true });

// Routes

app.get("/scrape", function (req, res) {

  axios.get("http://www.echojs.com/").then(function (response) {
    let $ = cheerio.load(response.data);
    const articleArr = [];
   
    $("article h2").each(function (i, element) {
      var result = {};

      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");

      articleArr.push(result);

      // db.Articles.create(scrapedArticles)
      //   .then(function(dbArticle) {
      //     console.log(dbArticle);
      //   })
      //   .catch(function(err) {
      //     console.log(err);
      //   });
     
    });

    db.Articles.create(articleArr)
      .then(() => res.send("Scrape Complete"))
      .catch(err => {
        console.log(err);
        res.json(err);
      })

  });
});

app.get("/articles", function (req, res) {
  db.Articles.find({})
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});


app.get("/articles/:id", function (req, res) {
  db.Articles.findOne({ _id: req.params.id })
    .populate("notes")
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});


app.post("/articles/:id", function (req, res) {
  db.Notes.create(req.body)
    .then(function (dbNote) {
      return db.Articles.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});


app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});