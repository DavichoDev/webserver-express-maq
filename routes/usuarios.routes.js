
const { Router } = require('express');
const { 
    usuariosGET, 
    usuariosPUT, 
    usuariosPOST, 
    usuariosDELETE, 
    usuariosPATCH } = require('../controllers/user.controller');

const router = Router();

router.get('/', usuariosGET );          

router.post('/', usuariosPOST );          

router.put('/:id', usuariosPUT );          

router.delete('/', usuariosDELETE );          

router.patch('/', usuariosPATCH );


module.exports = router;
