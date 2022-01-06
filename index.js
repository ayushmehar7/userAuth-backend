const app = require("./app")
const mongoose = require("mongoose")

mongoose.connect(process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD)).then(()=>{
    console.log("Database connected successfully!")
}).catch(err=>{
    console.err(err);
})

app.listen(process.env.PORT, (req, res)=>{
    console.log(`Server started in port ${process.env.PORT}`)
})