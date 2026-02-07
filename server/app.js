const express = require('express');
const cors = require('cors');
const app = express();

const userRouter = require("./routes/userRoutes");

app.use(cors({
    //for security
    origin: "https://ymelisk-user-management.netlify.app"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v2/users", userRouter);

module.exports = app;