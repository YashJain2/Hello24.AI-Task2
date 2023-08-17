const express = require("express");
const fetchRoute = require("./Routes/FetchRoute");
require("dotenv").config();
const { PORT } = process.env;

const app = express();

// To parse the json data
app.use(express.json());

//Routes
app.use("/", fetchRoute);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });

  //Testing the home route
app.get("/", (req,res) => {
    res.status(200);
    res.send("hello");
  })