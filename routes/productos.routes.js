const { Router } = require('express');
const { check } = require('express-validator');

// Middlewares
const { validarCampos, validarJTW, esAdminRole } = require('../middlewares');
// Controllers
const { getProductos, 
        getProductoID, 
        crearProducto, 
        actualizarProducto, 
        borrarProducto } = require('../controllers/productos.controller');
// Helpers
const { existeCategoriaNombre } = require('../helpers/categoria-validator');
const { validarNombreProducto } = require('../helpers/nombre-validator');

const router = Router();

/**
 * {{url}}/api/productos  
 */ 

// Obtener todos las productos - publico
router.get('/', [
    validarCampos
], getProductos); 

// Obtener un producto por ID - publico
router.get('/:id', [
    check('id', 'Este no es un ID de Mongo valido').isMongoId(),
    validarCampos
], getProductoID); 

// Crear nueva producto - privado - cualquier rol.
router.post('/', [
    validarJTW,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('nombre').custom( validarNombreProducto ),
    check('categoria', 'La categoria es obligatoria').not().isEmpty(),
    check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
    check('categoria').custom( existeCategoriaNombre ),
    validarCampos
], crearProducto); 

// Actualizar registro por ID - privado - cualquier rol.
router.put('/:id', [
    validarJTW,
    check('id', 'El ID que se envia no es valido en MongoDB').isMongoId(),
    validarCampos
], actualizarProducto); 

// Borrar una categoria - privado - ADMIN ROLE.
router.delete('/:id', [
    validarJTW,
    esAdminRole,
    check('id','Este ID no es valido en MongoDB').isMongoId(),
    validarCampos
], borrarProducto); 

module.exports = router;
