const { model, Schema } = require('mongoose');

const temptSchema = new Schema({
    Codf: {
        type: String,
        required: true,
        unique: true
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
    Stoc: {
        type: Number,
        required: false
        }
    }, { collection : 'Hola' });

module.exports = model('Hola', temptSchema)