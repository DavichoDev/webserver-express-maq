const { response, request } = require("express");
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');

const login = async ( req = request, res = response ) => {

    const { correo, password } = req.body;

    try {
        
        // Verificar si el Email Existe en la base de datos
        const usuario = await Usuario.findOne({ correo });
        if( !usuario ) {
            return res.status(400).json({
                msg: 'El usuario o contrasena no son validos. - correo'
            });
        }

        // Verificar si el usuario esta activo.
        if( !usuario.estado) {
            return res.status(400).json({
                msg: 'El usuario o contrasena no son validos. - estado: false'
            });
        }
        // Verificar la contrasena.
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if (!validPassword) {
            return res.status(400).json({
                msg: 'El usuario o contrasena no son validos. - password: false'
            });
        }

        // TODO: Generar un JWT



        
        res.json({
            msg: 'Login Ok'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }

};

module.exports = {
    login,
};