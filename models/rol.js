const mongoose=require("mongoose")

const rolSchema= new mongoose.Schema({
    nombre:String
})

module.exports=mongoose.model("rol",rolSchema)