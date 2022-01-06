const User = require("../models/userModel")
const authController = require("./authController")

exports.signUp = async(req, res)=>{
    try{
        const user = await User.create({
            name: req.body.name,
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
        },)
        authController.sendJWT(user, res, 201)
    }catch(err){
        res.status(400).json({
            status: "error",
            error: err
        })
    }
}

exports.getAllUsers = async(req,res)=>{
    const users = await User.find();
    res.status(200).json({
        status: "successful",
        users
    })
}

exports.login = async(req,res)=>{
    const {username, password} = req.body
    if(!username || !password){
        return res.status(400).json({
            status: "error",
            message: "Enter username and password"
        })
    }
    try{
        let user = await User.findOne({username})
        let passwordMatch = false
        if(user){
            user = await User.findOne({username}).select("+password")
            passwordMatch = await user.validatePassword(password, user.password)
        }
        if(!user || !passwordMatch){
            return res.status(401).json({
                status: "error",
                message: "Incorrect username or password"
            })
        }
        authController.sendJWT(user, res, 200)
    }catch(err){
        res.status(400).json({
            status: "error",
            error: err
        })
    }
}