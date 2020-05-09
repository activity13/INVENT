const { model, Schema } = require('mongoose');

const movimientosSchema = new Schema({
    Codf: {
        type: String,
        required: false
    },
    Descr: {
        type: String,
        required: false
    },
    Tipo: {
        type: String,
        required: true
    },
    Stock: {
        type: Number,
        required: false
    },
    Stock_Final: {
        type: Number,
        required: false
    },
    Almacen: {
        type: Number,
        required: false
    },
    Market: {
        type: Number,
        required: false
    },
    Cantidad: {
        type: Number,
        required: false
    }, 
    fecha: {
        type: Date,
        require: true
    }
}, { collection : 'productos' });

module.exports = model('Movimientos', movimientosSchema)