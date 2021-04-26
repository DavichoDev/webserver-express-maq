const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({

    nombre: {
        type: String,
        required: true,
        unique: true
    },
    precio: {
        type: Number,
        default: 0,
    },
    descripcion: { type: String, default: '' },
    disponible: { type: Boolean, default: true },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },

});

ProductoSchema.methods.toJSON = function() {
  
    const { __v, estado, ...producto } = this.toObject();
    return producto;
    
};

module.exports = model( 'Producto', ProductoSchema );