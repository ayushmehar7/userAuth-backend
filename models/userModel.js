const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false,
    },
    isadmin: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    passwordChangedAt : Date,
})

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next()
    }

    this.password = await bcrypt.hash(this.password, 12)
    next()

})

userSchema.pre("save", async function(next){
    if(!this.isModified("password") || this.isNew()){
        return next()
    }
    this.passwordChangedAt = Date.now() - 1000;
    next()
})

userSchema.methods.validatePassword = async function(input_password, user_password){
    return await bcrypt.compare(input_password, user_password)
}

userSchema.methods.changedPassword = function(JWTTime){
    if(this.passwordChangedAt){
        const timeStamp = parseInt(this.passwordChangedAt.getTime()/1000, 10)
        return JWTTime < timeStamp
    }
    return false
}

const User = mongoose.model("User", userSchema)
module.exports = User