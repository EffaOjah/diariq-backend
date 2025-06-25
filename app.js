// app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const errorHandler = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(errorHandler);

// Home route
app.get('/', (req, res) => {
    res.send('Welcome to Diariq');
});

// Use external routes
app.use("/", authRoutes);


module.exports = app;