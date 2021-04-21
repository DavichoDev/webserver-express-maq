const  validaCampos  = require('../middlewares/validar-campos');
const  validarJTW  = require('../middlewares/validar-jwt');
const  validaRoles  = require('../middlewares/validar-roles');

module.exports = {
    ...validaCampos,
    ...validarJTW,
    ...validaRoles,
}