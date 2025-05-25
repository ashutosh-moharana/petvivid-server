// models/PetPost.js
const mongoose = require("mongoose");

const petPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  petName: String,
  petType: String,
  description: String,
  type: { type: String, required: true },
  picture: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("petpost", petPostSchema);
