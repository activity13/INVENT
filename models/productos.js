const { model, Schema } = require('mongoose');

const temptSchema = new Schema({
    Codf: {
        type: String,
        required: true
    },
    Descr: {
        type: String,
        required: true
    },
    Pcns:{
        type: Number,
        required: false
    },
    Pvns: {
        type: Number,
        required: false
    },
    Pvns: {
        type: Number,
        required: true
    },
    Almacen: {
        type: Number,
        required: false
    },
    Stock: {
        type: Number,
        required: true
    }
}, { collection : 'productos' });

module.exports = model('productos', productoSchema)