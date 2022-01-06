const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const dotenv = require("dotenv")
const userRoutes = require("./routes/userRoutes")

dotenv.config({
    path: "./config.env"
})

const app = express()

app.use(cors())
app.use(morgan("tiny"))
app.use(express.json())
app.use("/api/users", userRoutes);

module.exports = app
    