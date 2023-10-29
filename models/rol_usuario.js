const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuario'
    },
    rol: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'rol'
    }
});

module.exports = mongoose.model("RolUsuario", schema);