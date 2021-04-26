
const Categoria = require('../models/categoria');

const existeCategoria = async ( _id = '') => {
    
    const existeIDCategoria = await Categoria.findById(_id);

    if ( !existeIDCategoria ) {
        throw new Error(`La categoria con el ID: ${ _id } no existe en la base de datos.`);
    }
};

const existeCategoriaNombre = async ( nombre = '') => {
    
    const existeNombreCategoria = await Categoria.findOne({ nombre });

    if ( !existeNombreCategoria ) {
        throw new Error(`La categoria con el nombre: ${ nombre } no existe en la base de datos.`);
    }
};
    
module.exports = {
    existeCategoria,
    existeCategoriaNombre
};

