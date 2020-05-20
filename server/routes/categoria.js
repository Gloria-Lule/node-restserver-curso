const express = require('express');
const Categoria = require('../models/categoria');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
const _ = require('underscore');

const app = express();

app.get('/categoria', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 0;
    limite = Number(limite);

    Categoria.find({})
        .populate('usuario', 'nombre  email')
        .sort('nombre')
        .skip(desde)
        .limit(limite)
        .exec((err, categorias) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                categorias
            })

        })


})

app.get('/categoria/:id', verificaToken, (req, res) => {

    let idCat = req.params.id;


    Categoria.findById(idCat, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoriaDB
        })

    });



})

app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;
    let categoria = new Categoria({
        nombre: body.nombre,
        usuario: req.usuario._id,
        estado: body.estado
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    });


})

app.put('/categoria/:id', (req, res) => {

    let idCat = req.params.id;

    let body = _.pick(req.body, ['nombre', 'estado']);

    Categoria.findByIdAndUpdate(idCat, body, { new: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

})

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let idCat = req.params.id;

    Categoria.findByIdAndDelete(idCat, (err, categoriaBorrada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (categoriaBorrada === null) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBorrada
        })
    });

})


module.exports = app;