const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El usuario es necesario']

    },
    estado: {
        type: Boolean,
        default: true
    }
});

categoriaSchema.methods.toJSON = function() {

    let categoria = this;
    let categoriaObject = categoria.toObject();

    return categoriaObject;
}

categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });

module.exports = mongoose.model('Categoria', categoriaSchema);