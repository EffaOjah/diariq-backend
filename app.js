// app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const errorHandler = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(errorHandler);

// Home route
app.get('/', (req, res) => {
    res.send('Welcome to Diariq');
});


module.exports = app;