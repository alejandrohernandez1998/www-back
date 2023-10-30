const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    usuario: String,
    estado: {
        type:String,
        default:"Preparandose"
    },
    fecha: {
        type: Date,
        default: () => new Date(Date.now() - 3 * 60 * 60 * 1000) // Resta 3 horas a la fecha actual
    },
    direccion:{
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    Monto: Number
});

module.exports = mongoose.model("Compra", schema);
