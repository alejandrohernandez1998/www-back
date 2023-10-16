const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    usuario: String,
    pedido: [{
        id_producto: mongoose.ObjectID,
        cantidad: Number
    }],
    estado: String
});

module.exports = mongoose.model("Compra", schema);
