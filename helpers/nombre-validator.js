const { Producto } = require('../models');

const validarNombreProducto = async ( termino = '' ) => {

    const nombre = termino.toUpperCase();
    const producto = await Producto.findOne({ nombre });
    if ( producto ) {
        throw new Error(`El nombre de producto: ${ nombreProducto } ya existe en la base de datos`);
    }

};

module.exports = {
    validarNombreProducto
}
