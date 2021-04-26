const { request, response } = require("express");
const { Categoria } = require('../models');

const getCategorias = async (req = request, res = response) => {

    // {{url}}/api/categorias?limite=5&desde=1
    const { limite = 5, desde = 0 } = req.query;
    // query para obtener categorias "Activas"
    const query = { estado: true };
    
    try {
        
        const [ total, categorias ] = await Promise.all([
            // Total de usuarios disponibles
            Categoria.countDocuments(query),
            // Categorias dependiendo de paginación
            Categoria.find(query)
            .populate('usuario', 'nombre')
            .skip( Number(desde) )
            .limit( Number(limite) ),
        ]);


        res.json({
            categorias,
            total
        });

    } catch (error) {
        
        console.log(error);
        return res.status(500).json({
            msg: 'Error del servidor, contactar con el administrador'
        });

    }

};

const getCategoriaID = async (req = request, res = response) => {

    const { id: idCategoria } = req.params;

    try {
        
        const categoria = await Categoria.findById( idCategoria ).populate('usuario', 'nombre');         

        res.json({
            categoria
        });

    } catch (error) {
        
        console.log(error);
        return res.status(500).json({
            msg: 'Error en el servidor, contacte el administrador.'
        });

    }

};

const crearCategoria = async (req = request, res = response) => {
   
    const nombre = req.body.nombre.toUpperCase();

    try {
        
        const categoriaDB = await Categoria.findOne({ nombre });

        if (categoriaDB) {
            return res.status(400).json({
                msg: `La categoria ${ nombre } ya existe`
            });
        }

        // Generar la data a guardar
        const data = {
            nombre,
            usuario: req.usuario._id,
        };

        const categoria = new Categoria(data);
        // Guardar categoria en la BD
        await categoria.save();

        res.status(201).json(categoria);

    } catch (error) {

        console.log(error);
        res.status(400).json({
            msg: 'Error de servidor, contacta con el administrador.'
        });
        
    }

};

const actualizarCategoria = async (req = request, res = response) => {
    
    const { id: idCategoria } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    try {
        
        const categoria = await Categoria.findByIdAndUpdate( idCategoria, data, { new: true } ).populate('usuario', 'nombre');

        res.json( categoria );

    } catch (error) {
        
        console.log(error);
        return res.status(500).json({
            msg: 'Error del servidor, contacte al administrador.'
        });

    }

};

const borrarCategoria = async (req = request, res = response) => {

    const { id: idCategoria } = req.params;
    const usuario = req.usuario._id;
    const query = { estado: false, usuario };

    try {
        
        const categoria = await Categoria.findByIdAndUpdate( idCategoria , query, {new: true} ).populate('usuario', 'nombre');

        res.json({
            msg: 'Se ha eliminado el siguiente registro:',
            categoria
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Error del servidor, contactar con el administrador'
        });
    }

};

module.exports = {
    getCategorias,
    getCategoriaID,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria,
};
