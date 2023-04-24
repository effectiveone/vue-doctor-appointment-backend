const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  mail: { type: String, unique: true },
  password: { type: String },
  type: { type: String, enum: ["doctor", "patient"] },
  isDoctor: { type: Boolean, default: false },
  isPatient: { type: Boolean, default: false },
});

module.exports = mongoose.model("user", userSchema);
