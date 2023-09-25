const mongoose = require("mongoose")
const empSchema = mongoose.Schema({
    firstname:{type:String,required:true},
    lastname:{type:String,required:true},
    email:{type:String,required:true},
    department:{type:String,required:true},
    salary:{type:Number,required:true}
})

const EmpModel = mongoose.model("employee",empSchema)
module.exports = {EmpModel}