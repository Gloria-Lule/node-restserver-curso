const express = require('express');
const Producto = require('../models/producto');
const { verificaToken } = require('../middlewares/autenticacion')
const app = express();
const _ = require('underscore');


//Obtiene todos los productos
app.get('/producto', verificaToken, (req, res) => {

    let desde = req.body.desde || 0;
    let limite = req.body.limite || 0;
    desde = Number(desde);
    limite = Number(limite);

    Producto.find({ disponible: true })
        .sort()
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                producto: productoDB
            })
        })
});

//Obtiene un producto por id
app.get('/producto/:id', verificaToken, (req, res) => {
    let idProd = req.params.id;

    Producto.findById(idProd, { disponible: true })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoDB

            });
        });
});

//Busqueda de productos

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;

    termino = RegExp(termino, 'i');

    Producto.find({ nombre: termino })
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            })
        })
});

//Crea un producto
app.post('/producto', verificaToken, (req, res) => {

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err

            });

        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

//Actualiza un producto por id
app.put('/producto/:id', verificaToken, (req, res) => {

    let idProd = req.params.id;

    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria']);


    Producto.findByIdAndUpdate(idProd, body, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {

            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({

            ok: true,
            producto: productoDB
        });



    });

});

//Elimina un producto por id
app.delete('/producto/:id', verificaToken, (req, res) => {

    let idProd = req.params.id;

    Producto.findByIdAndUpdate(idProd, { disponible: false }, { new: true }, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    })
});


module.exports = app