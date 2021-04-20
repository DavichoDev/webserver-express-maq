const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { esRoleValido, existeEmail, existeUsuarioPorID } = require('../helpers/db-validators');

const { 
    usuariosGET, 
    usuariosPUT, 
    usuariosPOST, 
    usuariosDELETE, 
    usuariosPATCH } = require('../controllers/user.controller');

const router = Router();

router.get('/', usuariosGET );          

router.post(
    '/', 
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'Debe de ser mas de 6 caracteres').isLength({ min: 6 }),
        check('correo', 'El correo no es valido').isEmail(),
        check('correo').custom( existeEmail ),
        // check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
        check('rol').custom( esRoleValido ),

        validarCampos
    ], 
    usuariosPOST );          

router.put(
    '/:id', 
    [
        check('id', 'No es un ID valido.').isMongoId(),
        check('id').custom( existeUsuarioPorID ),
        check('rol').custom( esRoleValido ),
        validarCampos
    ],
    usuariosPUT );          

router.delete(
    '/:id',
    [
        check('id', 'No es un ID valido.').isMongoId(),
        check('id').custom( existeUsuarioPorID ),

        validarCampos
    ],
    usuariosDELETE );          

router.patch('/', usuariosPATCH );

module.exports = router;
