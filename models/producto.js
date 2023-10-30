const mongoose=require("mongoose")

const productoSchema= new mongoose.Schema({
    nombre:String,
    precio:Number,
    visible: {
        type: Number,
        default: 1
    },
})

module.exports=mongoose.model("Producto",productoSchema)
