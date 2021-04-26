
const { Router } = require('express');
const { check } = require('express-validator');

// Middlewared
const { validarCampos } = require('../middlewares')
// Controlers
const { buscar } = require('../controllers/buscar.controller');

const router = Router();


router.get(
    '/:coleccion/:termino',
    [
        validarCampos
    ],
    buscar);


module.exports = router;
