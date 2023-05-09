const mongoose = require("mongoose");
const { Schema } = mongoose;

const gameSchema = new Schema({
  dateTime: {
    type: Date,
    required: true,
  },
  location: {
    type: {
      latitude: Number,
      longitude: Number,
      latitudeDelta: Number,
      longitudeDelta: Number,
    },
    required: true,
  },
  organizer: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  playerList: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  result: {
    type: String,
  },
});

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
