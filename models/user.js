const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Masculino", "Feminino", "Outro"],
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", DataSchema);
