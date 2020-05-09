const { model, Schema } = require('mongoose');

const pedidoSchema = new Schema({
    Codf: {
        type: Array,
        required: false
    },
    Descr: {
        type: Array,
        required: false
    },
    Cantidad: {
        type: Number,
        required: false
    }, 
    fecha: {
        type: Date,
        require: true
    },
    Tipo: {
        type: String,
        required: false
    }
}, { collection : 'pedidos' });

module.exports = model('Pedidos', pedidoSchema)