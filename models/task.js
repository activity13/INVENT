const { model, Schema } = require('mongoose');

const productoSchema = new Schema({
    codigo: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    cantidad:{
        type: Number,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
}, { collection : 'productos' });

module.exports = model('productos', productoSchema)