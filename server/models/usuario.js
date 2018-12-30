const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Definimos los roles validos para los uaurios y el mensaje de error en caso de que no sea correcto.
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
};

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        required: [true, 'El correo es necesario'],
        unique: true // esto hará que sólo pueda grabar una vez este correo electronico (el resto puede ser igual)
    },
    password: {
        type: String,
        required: [true, 'La Contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }

});

// Viene de routes/usuario.js dónde haya un (***)
// Con esto lo que hacemos es lo que hemos comentado antes, 
// es decir, eliminamos por completo del JSON devuelto, la referencia y el dato
// de la contraseña. Es decir, la contraseña, se crea con el usuario y se almacena en este
// pero no queremos devolver absolutamente nada como respuesta para no dar pistas
// a un posible atacante.
// Lo hacemos de la siguiente forma: modificando el JSON devuelto
usuarioSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    // Aquí es dónde eliminamos la referencia al password
    delete userObject.password;

    return userObject;
}


usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('Usuario', usuarioSchema);