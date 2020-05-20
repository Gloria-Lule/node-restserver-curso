const jwt = require('jsonwebtoken');


//==============================
//  Verificar Token
//==============================

let verificaToken = (req, res, next) => {

    let token = req.query.token ? req.query.token : req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                message: 'Token no valido'
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
}


//==============================
//  Verificar Admin_Role
//==============================

let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role != 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            message: 'El usuario no esta autorizado'
        });
    } else {
        next();
    }
}

module.exports = {
    verificaToken,
    verificaAdmin_Role
}