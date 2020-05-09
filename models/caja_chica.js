const { model, Schema } = require('mongoose');

const caja_chicaSchema = new Schema({
    Creacion: {
        responsable: {
            type:String,
            require: true
        },
        montoInit: {
            type: Number,
            required: true
        },
        fechaInit: {
            type: Date,
            require: true
        }
    },
    Fecha: {
        type: Array,
        required: true,
    },
    Tipo: {
        type: Array,
        required:true
    },
    Numero: {
        type: Array,
        required:true
    },
    Proveedor: {
        type: Array,
        required:true
    },
    Razon: {
        type: Array,
        required:true
    },
    Monto: {
        type: Array,
        required: true
    },
    Saldo: {
        type: Array,
        required: true
    }
}, { collection : 'cajaChica' });

module.exports = model('cajaChica', caja_chicaSchema)  