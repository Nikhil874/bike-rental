const express = require("express");
const connect = require("./src/db/config");
const UserController = require("./src/controller/authController");
const BikeController = require("./src/controller/bikeController");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/users", UserController);
app.use("/bikes", BikeController);
let port = 8000;

app.listen(port, async () => {
  try {
    await connect();
    console.log(`listening to port ${port}`);
  } catch (e) {
    console.log(e.message);
  }
});
