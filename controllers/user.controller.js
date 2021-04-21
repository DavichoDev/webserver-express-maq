const { response, request } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { countDocuments } = require('../models/usuario');

const usuariosGET = async (req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, usuarios ] = await Promise.all([
        // Total de usuarios disponibles
        Usuario.countDocuments(query),
        // Usuarios dependiendo de paginación
        Usuario.find(query)
        .skip( Number(desde) )
        .limit( Number(limite) ),
    ]);

    res.json({
        total,
        usuarios
    });
};

const usuariosPOST = async (req = request, res = response) => {

    try {
        
        const { nombre, correo, password, rol } = req.body;
        const usuario = new Usuario( {nombre, correo, password, rol} );

        // Encriptar la contrasena
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync( password, salt );

        // Guardar en la DB
        await usuario.save();

        res.status(201).json({
            usuario
        });
        
    } catch (error) {
        console.log(error);
    }

};

const usuariosPUT = async (req = request, res = response) => {

    const { id } = req.params;

    const { password, google, ...resto } = req.body;

    if( password ) { 
        // Encriptar la contrasena
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
     }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json( usuario );
};

const usuariosDELETE = async (req = request, res = response) => {

    const { id } =  req.params;
    const uid = req.uid;
    const usuarioAutentificado = req.usuario;

    // Borrado fisicamente
    // const usuario = await Usuario.findByIdAndDelete( id );

    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

    res.status(201).json({usuario, usuarioAutentificado});
};

const usuariosPATCH = (req = request, res = response) => {
    res.status(201).json({
        msg: 'PATCH Api'
    });
};

module.exports = {
    usuariosGET,
    usuariosPUT,
    usuariosPOST,
    usuariosDELETE,
    usuariosPATCH,
};
