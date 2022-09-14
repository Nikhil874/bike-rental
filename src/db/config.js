const mongoose = require("mongoose");
module.exports = () => {
  mongoose.connect(
    "mongodb+srv://Nikhil874:Nikil874@cluster0.3l0um.mongodb.net/bike-rental"
  );
};
