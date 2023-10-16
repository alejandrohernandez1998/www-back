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

module.exports=mongoose.model("usuario",usuarioSchema)
