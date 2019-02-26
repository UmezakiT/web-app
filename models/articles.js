let mongoose = require("mongoose");

let Schema =mongoose.Schema;

let ArticleSchema= new Schema({

  title:{
    type: String,
    required: true
  },

  link:{
    type: String,
    required: true
  },

  note:{
    type: Schema.Types.ObjectId,
    ref:'Note'
  }
});

let Articles = mongoose.model('Articles',ArticleSchema);

module.exports = Articles;