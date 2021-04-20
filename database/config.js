const mongoose = require('mongoose');
require('colors');

const dbConnection = async () => {

    try {

        await mongoose.connect( process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });

        console.log('Base de datos ONLINE'.green);
        
    } catch (error) {
        console.log(error);
        throw new Error('Error al inicializar la BASE DE DATOS.')
    }

};


module.exports = {
    dbConnection,
}