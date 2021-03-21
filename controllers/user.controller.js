const { response, request } = require('express')

const usuariosGET = (req = request, res = response) => {

    const query = req.query;

    res.status(201).json({
        msg: 'GET Api',
        query
    });
};

const usuariosPOST = (req = request, res = response) => {

    const body = req.body;

    res.status(201).json({
        msg: 'POST Api',
        body
    });
};

const usuariosPUT = (req = request, res = response) => {

    const id = req.params.id;

    res.status(201).json({
        msg: 'PUT Api',
        id
    });
};

const usuariosDELETE = (req = request, res = response) => {
    res.status(201).json({
        msg: 'DELETE Api'
    });
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
}