const res = require("express/lib/response")
const jwt = require("jsonwebtoken")
const {promisify} = require("util")
const User = require("../models/userModel")


exports.sendJWT = (user,res,statusCode) =>{
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN})
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN*24*60*60*1000),
        httpOnly: true
    }
    res.cookie("jwt", token,cookieOptions)
    user.password =  undefined
    user.isadmin = undefined
    delete user._id
    res.status(statusCode).json({
        status: "succesful",
        token,
        user
    })
}

exports.loginRequired = async (req, res, next)=>{
    let token
    try{
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            token = req.headers.authorization.split(" ")[1]
        }
        if(!token){
            return res.status(401).json({
                "status": "Unauthorized",
                "message": "Please sign up or login to continue"
            })
        }
        let decoded_id
        try{
            decoded_id = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
        }catch(err){
            return res.status(401).json({
                "status": "Unauthorized",
                "message": "Please login again!"
            })
        }
        const user = await User.findById(decoded_id.id)
        if(!user){
            return res.status(401).json({
                status: "Unauthorized",
                message: "User not found, login again"
            })
        }
        if(user.changedPassword(decoded_id.iat)){
            return res.status(401).json({
                status: "Unauthorized",
                message: "Session expired, login again"
            })
        } 
        req.user = user
        next()
    }catch(err){
        console.log(err)
    }
}

exports.restrictToAdmin = (req, res, next)=>{
    if(!req.user){
        return res.status(401).json({
            "status": "Unauthorized",
            "message": "Please sign up or login to continue"
        })
    }
    const user = req.user
    if(!user.isadmin){
        return res.status(403).json({
            "status": "Unauthorized",
            "message": "Access denied"
        })
    }
    next()
}