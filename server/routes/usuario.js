// Para ejecutarlo: node server/server.js
const express = require('express');
const Usuario = require('../models/usuario.js');
const bcrypt = require('bcrypt');
const _under = require('underscore');

const app = express();

// Suele ser para obtener registros
app.get('/usuario', function(req, res) {

    // Llamaremos este metodo desde POSTMAN: 
    // {{url}}/usuario?desde=5&limite=10
    // LLamaremos este metodo desde un navegador con:
    // http://localhost:3000/usuario?desde=5&limite=10

    // Con esto leemos el parametro desde que "puede venir o no", en la llamada al metodo de GET
    // deberiamnos asegurare que desde, siempre es un numero. 
    let desde = req.query.desde || 0;
    // Esto es como hacer un VAL (en foxpro)
    desde = Number(desde);

    // Con esto leemos el parametro desde que "puede venir o no", en la llamada al metodo de GET
    // deberiamnos asegurare que desde, siempre es un numero. 
    let limite = req.query.limite || 5;
    // Esto es como hacer un VAL (en foxpro)
    limite = Number(limite);

    // find --> Devuelve n registros filtrados o no. Si no especificamos parametro, es sin filtrar
    // find.skip --> Salta los n primeros registros
    // find.limit -> Devuelve los n siguientes registros desde la posición del puntero
    // El segundo parametro del .find, permite indicar qué campos queremos devolver:
    // 'role estado nombre email img google', si sólo quisieramos devolver, nombre y email, pondriamos: 
    // 'nombre email' (NOTA: el id, siempre viene devuelto)
    Usuario.find({ estado: true }, 'role estado nombre email img google')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }

            // En este count, el filtro debe ser exactamente el mismo que en la función padre .find, es decir {}.
            // eso es para que el count cuente, los mismos registros que obtenemos en la consulta mediante el find
            // si por ejemplo, quisieramos que esta consulta sólo fuese de los que son de google, pondriamos las condiciones así:
            // Usuario.find({google:true}) y aquí, al contar, lo mismo: Usuario.count({google:true})
            Usuario.count({ estado: true }, (err, conteo) => {
                // TotalConsultados, será la cantidad de registros que consultamos en esta pagina (vendrá determinado por 'desde' y 'limite')
                // TotalDisponibles, será la cantidad de registros que podriamos consultar con el filtro que estamos usando
                res.json({
                    ok: true,
                    TotalConsultados: usuarios.length,
                    TotalDisponibles: conteo,
                    usuarios: usuarios
                });

            });

        });



})

// Suele ser para crear nuevos registros
app.post('/usuario', function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        // Esta linea, permitiria esconder la información del password, pero
        // aún estariamos enviando al json el nombre del campo o sea que un "atacante"
        // sabría con esto que el campo dónde almacenamos la contraseña, se llama "password"
        // Es una información que podemos ahorrarnos y es más seguro, no darla
        // Por eso, comentamos esta linea (aunque podria servir en algun caso) y para ocultar
        // totalmente el dato de la contraseña, modificaremos en el Modelo, el json que nos devuelve
        // eliminando por completo la referencia al campo "password", en la información devuelta            
        // ver en models/usuario.js, dónde haya un (***)
        // usuarioDB.password = null;

        res.json({
            ok: true,
            usuaruio: usuarioDB
        });
    });

})

// Suele ser para actualizar registros que ya existen
app.put('/usuario/:iduser', function(req, res) {

    let CodigoUsuario = req.params.iduser;
    // let body = req.body;

    // usamos la función pick de la libreria underscore, para definir qué campos, serán
    // modificables. Los que no se pongan en el arreglo, será que no lo son.
    let body = _under.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado'])

    // ver documentación de mongoose
    // El tercer parametro es un objeto y le paso como parametro: new: true
    // eso hace que la respuesta del PUT, sea el registro modificado
    // si lo pusieramos a false o no lo pasamos, nos devuelve el usuario antes de la modificación
    // aunque ejecuta el cambio y lo modifica a la BBDD, lo que nos devuelve con el false, 
    // es el usuario antes de hacerle el cambio, por si queremos hacer algo con él.
    // El tercer parametro es un objeto y le paso como parametro: runValidators: true
    // Esto es necesario, ya que si no lo ponemos o está a false, no ejecuta las validaciones que haya
    // definidas en el Modelo de datos, es decir, que por ejemplo el campo ROLE, no estaría sujeto a las 
    // restricciones de roles validos que hemos hecho en la validación del mismo y podriamos grabar en él
    // datos no validos como la cadena 'jajdhnbejud', en vez de 'ADMIN_ROLE', 'USER_ROLE', que son los que 
    // que tiene definidos como datos posibles.
    Usuario.findByIdAndUpdate(CodigoUsuario, body, { new: true, runValidators: true }, (err, usuarioBD) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBD
        })

    })

})

// Suele ser para actualizar registros que ya existen
app.delete('/usuario/:iduser', function(req, res) {

    let CodigoUsuario = req.params.iduser;
    // let body = req.body;

    // usamos la función pick de la libreria underscore, para definir qué campos, serán
    // modificables. Los que no se pongan en el arreglo, será que no lo son.
    let body = _under.pick(req.body, ['estado'])

    body.estado = false;

    // ver documentación de mongoose
    // El tercer parametro es un objeto y le paso como parametro: new: true
    // eso hace que la respuesta del PUT, sea el registro modificado
    // si lo pusieramos a false o no lo pasamos, nos devuelve el usuario antes de la modificación
    // aunque ejecuta el cambio y lo modifica a la BBDD, lo que nos devuelve con el false, 
    // es el usuario antes de hacerle el cambio, por si queremos hacer algo con él.
    // No le pasamos al tercer parametro la directiva: runValidators: true, ya que no queremos que se
    // revise las directivas del sistema

    Usuario.findByIdAndUpdate(CodigoUsuario, body, { new: true }, (err, usuarioBD) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBD
        })

    })

    // Una alternativa, seria no leer el body y pasarle directamente en el segundo parametro, los datos que queremos cambiar
    //    Usuario.findByIdAndUpdate(CodigoUsuario, {estado:false}, { new: true }, (err, usuarioBD) => {

    // Una alternativa, seria no leer el body y pasarle directamente en el segundo parametro, un objeto de datos a cambiar
    // let datosaCambiar = {estado: false};
    // Usuario.findByIdAndUpdate(CodigoUsuario, datosaCambiar, { new: true }, (err, usuarioBD) => {


})

// Suele ser para eliminar o marcar como borrado un registro
// Fijemonos que hemos introducido la url: fisicaldelete para el delete.
// Con esto, lo que haremos es permitir el borrado físico del disco de un usuario.
// lo hemos diferenciado del metodo delete normal, añadiendo una /fisicaldelete, de tal forma
// que se podria llegar a llamar a la url para que o bien marque como eliminado un registro 
// eso es mediante: estado = false o bien, lo elimine fisicamente del disco, con esta opción
app.delete('/usuario/fisicaldelete/:id', function(req, res) {

    // Ejemplo de llamada a este método:
    // desde POSTMAN: {{url}}/usuario/fisicaldelete/5c15f6ab692eec1444901bb6

    let ID = req.params.id;

    Usuario.findByIdAndRemove(ID, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        };

        if (usuarioBorrado === null) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

    })

})

module.exports = app;