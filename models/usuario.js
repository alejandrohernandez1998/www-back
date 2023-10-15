const mongoose=require("mongoose")

const usuarioSchema= new mongoose.Schema({
    rut:String,
    nombre:String,
    direccion:String,
    comuna:String,
    provincia:String,
    region:String,
    sexo:String,
    telefono:String,
    email:String,
    pass:String,
    rol:String
})

const productoSchema= new mongoose.Schema({
    nombre:String,
    precio:String
})

module.exports=mongoose.model("usuario",usuarioSchema)
module.exports=mongoose.model("producto",productoSchema)