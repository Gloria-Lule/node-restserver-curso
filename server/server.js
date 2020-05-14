require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(require('./routes/usuario'));

mongoose
    .connect(process.env.URLDB, {

        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
    .then(() => console.log('base de datos ONLINE'))
    .catch(err => console.log('No se pudo conectar', err));


app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto:', process.env.PORT);
})