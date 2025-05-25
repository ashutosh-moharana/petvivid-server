const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  userpic: String,
  email: { type: String, required: true, unique: true },
  password: String,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "petpost" }],
});

module.exports = mongoose.model("user", userSchema);
