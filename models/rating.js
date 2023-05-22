const mongoose = require("mongoose");
const { Schema } = mongoose;

const ratingSchema = new Schema({
  game: {
    type: Schema.Types.ObjectId,
    ref: "Game",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
});

const Rating = mongoose.model("Rating", ratingSchema);

module.exports = Rating;
