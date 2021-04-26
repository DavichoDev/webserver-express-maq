const { Router } = require('express');
const { check } = require('express-validator');

// Middlewares
const { validarCampos, validarJTW, esAdminRole } = require('../middlewares');
// Controllers
const { getCategorias, 
        getCategoriaID,
        crearCategoria,
        actualizarCategoria,
        borrarCategoria } = require('../controllers/categorias.controller');
const { existeCategoria } = require('../helpers/categoria-validator');

const router = Router();

/**
 * {{url}}/api/categorias  
 */ 

// Obtener todas las categorias - publico
router.get('/', [
    validarCampos
], getCategorias); 

// Obtener una categoria por ID - publico
router.get('/:id', [
    check('id').custom( existeCategoria ),
    check('id', 'No es un ID valido de MongoDB').isMongoId(),
    validarCampos
], getCategoriaID); 

// Crear nueva categoria - privado - cualquier rol.
router.post('/', [
    validarJTW,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria); 

// Actualizar registro por ID - privado - cualquier rol.
router.put('/:id', [
    validarJTW,
    check('id').custom( existeCategoria ),
    check('id', 'No es un ID valido de MongoDB').isMongoId(),
    check('nombre', 'El nombre es necesario para actualizar').not().isEmpty(),
    validarCampos
], actualizarCategoria); 

// Borrar una categoria - privado - ADMIN ROLE.
router.delete('/:id', [
    validarJTW,
    esAdminRole,
    check('id', 'No es un ID valido de MongoDB').isMongoId(),
    validarCampos,
    check('id').custom( existeCategoria ),
    validarCampos
], borrarCategoria); 

module.exports = router;
