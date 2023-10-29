const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'producto'
    },
    compra: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'compra'
    },
    cantidad:Number
});

module.exports = mongoose.model("ProductoCompra", schema);