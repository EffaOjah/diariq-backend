// app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const errorHandler = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const diaryRoutes = require("./routes/diaryRoutes");

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(errorHandler);

// Home route
app.get('/', (req, res) => {
    res.send('<h1 style="color: purple">Welcome to Diariq</h1>');
});

// Use external routes
app.use("/", authRoutes);
app.use("/", diaryRoutes);


module.exports = app;