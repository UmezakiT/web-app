let mongoose= require("mongoose");

let Schema =mongoose.Schema;

let NoteSchema = new Schema({
  title:String,
  body:String
});

let Notes = mongoose.model("Notes", NoteSchema);

module.exports=Notes;