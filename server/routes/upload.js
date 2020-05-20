const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path')

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: " No se ha seleccionado ningun archivo"
            }
        });
    }

    //Valida tipo
    let tiposValidos = ['producto', 'usuario'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Los tipos permitidos son ${ tiposValidos.join(', ')}`,
                tipo
            }
        })
    }



    let archivo = req.files.archivo;

    let archivoCortado = archivo.name.split('.');
    let extension = archivoCortado[1];


    //Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Las extensiones permitidas son ${ extensionesValidas.join(', ')}`,
                ext: extension
            }
        })
    }

    //Cambiar nombre del archivo

    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        //Aqui - imagen cargada - Guardar en BD
        guardarImagen(id, res, nombreArchivo, tipo);

    });
});

function guardarImagen(id, res, nombreArchivo, tipo) {

    let tipoDB

    if (tipo === 'usuario') {
        tipoDB = Usuario;

    } else {
        tipoDB = Producto;
    }


    tipoDB.findById(id, (err, resDB) => {

        if (err) {

            borraArchivo(nombreArchivo, tipo);
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!resDB) {
            borraArchivo(nombreArchivo, tipo);
            return res.status(400).json({
                ok: false,
                err: {
                    message: `El ${tipo} no existe`
                }
            });

        }

        borraArchivo(resDB.img, tipo);

        resDB.img = nombreArchivo;

        resDB.save((err, tipoGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                tipo: tipo,
                info: tipoGuardado
            });

        })


    });

}

function borraArchivo(nombreArchivo, tipo) {

    let pathImage = path.resolve(__dirname, `../../uploads/${tipo}/${nombreArchivo}`);

    if (fs.existsSync(pathImage)) {

        fs.unlinkSync(pathImage);

    }


}

module.exports = app;