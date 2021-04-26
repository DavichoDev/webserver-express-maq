const { request, response } = require("express");
const { Producto, Categoria } = require('../models');
const producto = require("../models/producto");

// CRUD
const getProductos = async (req = request, res = response) => {

    const { limite = 5, desde = 0} = req.query;
    const query = { estado: true };

    try {
    
        const [ total, productos ] = await Promise.all([
            producto.countDocuments(query),
            producto.find(query)
            .populate('usuario', 'nombre')
            .skip( Number(desde) )
            .limit( Number(limite) )
        ]);

        res.json({
            total,
            productos
        });

    } catch (error) {
        
        console.log(error);
        return res.status(500).json({
            msg: 'Error del servidor, contactar con el administrador'
        });

    }

};

const getProductoID = async (req = request, res = response) => {

    const { id } = req.params;

    try {

        const producto = await Producto.findById( id )
                                .populate('usuario', 'nombre')
                                .populate('categoria', 'nombre');

        if( !producto ){
            return res.status(404).json({
                msg: `El producto con el ID: ${ id } no existe en la Base de datos`
            });
        }

        res.json({
            producto
        });

    } catch (error) {
        
        console.log(error);
        return res.status(500).json({
            msg: 'Error del servidor, contactar con el administrador'
        });

    }

};

const crearProducto = async (req = request, res = response) => {

    const { nombre: nombreProducto , descripcion, precio, categoria: nombreCategoria } = req.body;
    
    try {

        const { _id } = await Categoria.findOne({ nombre: nombreCategoria });
        
        const data = {
            nombre: nombreProducto.toUpperCase(),
            descripcion,
            precio,
            categoria: _id,
            usuario: req.usuario._id,
        };

        const producto = new Producto( data );
        producto.save();

        res.json({
            producto
        });

    } catch (error) {
        
        console.log(error);
        return res.status(500).json({
            msg: 'Error del servidor, contactar con el administrador'
        });

    }

};

const actualizarProducto = async (req = request, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;    

    if( data.nombre !== undefined ) { data.nombre = data.nombre.toUpperCase(); }

    try {

        // Validación de la categoria.
        if ( req.body.categoria ) {
            const nombreCategoria = req.body.categoria.toUpperCase();
            const categoria = await Categoria.findOne( {nombre: nombreCategoria} );
            if (!categoria) {
                return res.status(404).json({
                    msg: "No existe esa categoria en la base de datos"
                });    
            } else {
                data.categoria = categoria.id;
            }
        }

        const producto = await Producto.findByIdAndUpdate( id, data, { new: true } ).populate('categoria', 'nombre');

        res.json({
            producto
        });

    } catch (error) {
        
        console.log(error);
        return res.status(500).json({
            msg: 'Error del servidor, contactar con el administrador'
        });
    }
};

const borrarProducto = async (req = request, res = response) => {

    const { id } = req.params;
    const query = { estado: false };

    try {
    
        const producto = await Producto.findByIdAndUpdate( id, query, { new: true } );

        res.json({
            producto
        });

    } catch (error) {
        
        console.log(error);
        return res.status(500).json({
            msg: 'Error del servidor, contactar con el administrador'
        });

    }

};


module.exports = {
    getProductos,
    getProductoID,
    crearProducto,
    actualizarProducto,
    borrarProducto,
};