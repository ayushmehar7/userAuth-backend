const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const authController = require("../controllers/authController")

router.get("/", authController.loginRequired, authController.restrictToAdmin, userController.getAllUsers)

router.post("/signup", userController.signUp)
.post("/login", userController.login)

module.exports = router