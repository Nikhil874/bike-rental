const { string } = require("joi");
const mongoose = require("mongoose");
const bikeSchema = new mongoose.Schema(
  {
    color: { type: String, required: true },
    model: { type: String, required: true },
    image: { type: String, required: true },
    location: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    avgRating: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("bikes", bikeSchema);
