const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const productoSchema = new mongoose.Schema({
    idproducto: String,
    cantidad: Number
});

const schema = new mongoose.Schema({
    usuario: String,
    estado: String,
    productos: [productoSchema] // Añade el arreglo de productos al esquema
});

module.exports = mongoose.model("Compra", schema);
