//=====================
// Entorno
//=====================
process.env.PORT = process.env.PORT || 3000;

//=====================
// Base de Datos
//=====================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://ADMIN_LULE:NfC2TcpCq6TQyMUK@cluster0-xcfvh.mongodb.net/cafe';
}

process.env.URLDB = urlDB;