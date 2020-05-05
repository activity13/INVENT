const { model, Schema } = require('mongoose');

const temptSchema = new Schema({
    Codf: {//Se actualiza en Crear
        type: String,
        required: true,
        unique: true
    },
    Descr: {//Se actualiza en Crear
        type: String,
        required: true
    },
    Pcns:{//Se actualiza en Crear
        type: Number,
        required: false
    },
    Pvns: {//Se actualiza en Crear
        type: Number,
        required: false
    },
    Stock: {//Se actualiza en Crear, Almacen
        type: Number,
        required: false
    },
    Almacen: {//Se actualiza en Almacen
        type: Number,
        required: false
    },
    almini: {//Se actualiza en Almacen
        type: Number,
        required: false
    },
    almaxi: {//Se actualiza en Almacen
        type: Number,
        required: false  
    },
    Market: {//Se actualiza en Index
        type: Number,
        required: false
    },
    mamini: {//Se actuazliza en Index
        type: Number,
        required: false
    },
    mamaxi: {//Se actualiza en Index
        type: Number,
        required: false
    }
},{ collection : 'Hola' });

module.exports = model('Hola', temptSchema)   