const express = require('express');
const fs = require('fs');
const path = require('path');
const { verificaToken } = require('../middlewares/autenticacion');

const app = express();

app.get('/imagen/:tipo/:img', verificaToken, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;



    let pathImage = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    let noImagePath = path.resolve(__dirname, '../assets/no_image.jpg');

    if (fs.existsSync(pathImage)) {
        res.sendFile(pathImage);
    } else {
        res.sendFile(noImagePath);
    }

});


module.exports = app;