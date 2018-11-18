// Obtenemos los parametros del fichero de configuración global
require('./config/config');

// Para ejecutarlo: node server/server.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Suele ser para obtener registros
app.get('/usuario', function(req, res) {
    res.json('get Usuario')
})

// Suele ser para crear nuevos registros
app.post('/usuario', function(req, res) {

    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });
    } else {
        res.json({
            persona: body
        })
    }


})

// Suele ser para actualizar registros que ya existen
app.put('/usuario/:iduser', function(req, res) {

    let CodigoUsuario = req.params.iduser;

    res.json({
        id: CodigoUsuario
    })
})

// Suele ser para eliminar o marcar como borrado un registro
app.delete('/usuario', function(req, res) {
    res.json('delete Usuario');
})


app.listen(process.env.PORT, () => {
    console.log(`Escuchando el puerto`, process.env.PORT);
})