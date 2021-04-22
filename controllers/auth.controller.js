const { response, request } = require("express");
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
// Custom
const { generarJWT } = require("../helpers/generarJWT");
// Helpers
const { googleVerify } = require("../helpers/google-verify");

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
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }

};

const googleSignIn = async ( req = request, res = response ) => {

    const { id_token } = req.body;

    try {

        const { correo, nombre, img } = await googleVerify( id_token );

        let usuario = await Usuario.findOne({ correo });

        // Verificar si existe o no el usuario en la BD
        if( !usuario ){
             const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            };
            usuario = new Usuario( data );
            await usuario.save();
        } 

        // Validar en usuario en la BD
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Hable con el administrador, el usuario esta bloqueado.'
            }); 
        }

        // Generar JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        });
        
    } catch (error) {
        
        console.log(error);
        return res.satus(400).json({
            msg: 'Token de Google no es valido.'
        });

    }

};

module.exports = {
    login,
    googleSignIn,
};