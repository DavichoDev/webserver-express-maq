const { request, response } = require("express");
const { ObjectId } = require('mongoose').Types;
const { Usuario, Categoria, Producto } = require('../models')

const buscarUsuarios = async ( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); 

    // Busqueda por ID
    if ( esMongoID ) {
        const usuario = await Usuario.findById( termino );
        return res.json({
            results: (usuario) ? [ usuario ] : []
        });
    }        

    // Busqueda por termino
    const regex = new RegExp( termino, 'i' );
    const usuarios = 
        await Usuario.find({
            $or: [ { nombre: regex, }, { correo: regex } ],
            $and: [ {estado: true} ]
        });
    // Response
    res.json({
        results: usuarios 
    });

};

const buscarCategoria = async ( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); 

    // Busqueda por ID
    if ( esMongoID ) {
        const categoria = await Categoria.findById( termino );
        return res.json({
            results: (categoria) ? [ categoria ] : []
        });
    }        

    // Busqueda por termino
    const regex = new RegExp( termino, 'i' );
    const categorias = 
        await Categoria.find({
            $or: [ { nombre: regex, } ],
            $and: [ {estado: true} ]
        })
        .populate('usuario', 'nombre');
    // Response
    res.json({
        results: categorias
    });

};

const buscarProducto = async ( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); 

    // Busqueda por ID
    if ( esMongoID ) {
        const producto = await Producto.findById( termino );
        return res.json({
            results: (producto) ? [ producto ] : []
        });
    }        

    // Busqueda por termino
    const regex = new RegExp( termino, 'i' );
    const productos = 
        await Producto.find({
            $or: [ { nombre: regex, }, { descripcion: regex } ],
            $and: [ {estado: true} ]
        })
        .populate('categoria', 'nombre');
        
    // Response
    res.json({
        results: productos 
    });

};

const buscar = (req = request, res = response) => {

    const { coleccion, termino } = req.params;

    const coleccionesPermitidas = [
        'usuarios',
        'categorias',
        'productos',
    ];

    try {
        
        if ( !coleccionesPermitidas.includes( coleccion ) ) {
            return res.status(404).json({
                msg: `Esta coleccion no es valida, prueba con las siguientes: ${ coleccionesPermitidas }`
            });
        }

        switch (coleccion) {
            case 'usuarios':
                buscarUsuarios( termino, res );
            break;

            case 'categorias':
                buscarCategoria( termino, res );
            break;

            case 'productos':
                buscarProducto( termino, res )
            break;

            default:
                res.status(500).json({
                    msg:'Se me olvido hacer esta busqueda'
                });

        }

    } catch (error) {
        
        console.log(error);
        return res.status(500).json({
            msg: 'Error de servidor, contactar con el administrador'
        });

    }

};

module.exports = {
    buscar,
};
