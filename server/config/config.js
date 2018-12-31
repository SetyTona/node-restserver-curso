// ==========================================
// Puerto
// ==========================================

// Si existe el puerto, cogemos el puerto, sino le ponemos el 3000
process.env.PORT = process.env.PORT || 3000;

// ==========================================
// Entorno
// ==========================================

// Si existe algo, es que estoy en producción (lo establece heroku)
// Por lo que si no existe, es que estamos en desarrollo (development), no en producción
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ==========================================
// BBDD
// ==========================================

let urlBBDD;

if (process.env.NODE_ENV === 'dev') {
    // Si estamos en desarrollo, cogemos la ruta de nuestro server local
    urlBBDD = 'mongodb://localhost:27017/cafe';
} else {
    // Si no estamos en desarrollo, cogemos la ruta de nuestro server en la nube
    // 'mongodb://<user>:<password>@ds145474.mlab.com:45474/cafe';
    // <user> y <password> : obtenidos de mLab, usuarios con acceso permitido a la BBDD cafe
    // urlBBDD = 'mongodb://cafe-user:cafe123456@ds145474.mlab.com:45474/cafe';

    // Hemos ocultado esta cadena de conexión para que cuando lo subamos a GITHUB, no esté disponible para los demás 
    // usuarios, ya que en ella, aparece el nombre de usuario con acceso a la BBDD y su password.
    // Para ocultarlo, creamos una variable de entorno en HEROKU
    // para eso, lo que hacemos es desde el directorio del aplicativo, hacer lo siguiente:
    //  heroku config:set MONGO_URI="mongodb://cafe-user:cafe123456@ds145474.mlab.com:45474/cafe"
    // con esto, crearemos la variable de proceso MONGO_URI
    // y luego substituimos, la cadena de conexión por la variable MONGO_URI

    urlBBDD = process.env.MONGO_URI;

}

// Esto lo hacemos para compartir la variable en otros ficheros
// como por ejemplo, el server.js que usará la misma, para saber cual es
// la cadena de conexión a usar en cada momento. Dependiendo de si está en 
// desarrollo o en prodcucción
process.env.URLBBDD = urlBBDD;