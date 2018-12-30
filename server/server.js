// Obtenemos los parametros del fichero de configuración global
require('./config/config');

// Para ejecutarlo: node server/server.js
const express = require('express');
const mongoose = require('mongoose'); // 15-12-2018 Add by JR (MongoDB)

const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/usuario.js'));

mongoose.connect(process.env.URLBBDD, (err, res) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');
})

app.listen(process.env.PORT, () => {
    console.log(`Escuchando el puerto`, process.env.PORT);
})