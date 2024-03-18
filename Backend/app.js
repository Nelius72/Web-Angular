'use strict'

//Cargar módulos de node para crear servidor

var express = require('express');
const bodyParser = require('body-parser');

//Ejecutar express (http)

var app = express();

//Cargar ficheros de rutas

var article_routes = require('./routes/article');
//Middlewares

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


//Activar CORS para permitir peticiones desde el frontend (Ajax, peticiones asíncronas etc...) que tenemos en otra dirección ip

// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


//Añadir prefijos a rutas / Cargar rutas

app.use('/api',article_routes);



//Exportar módulo (fichero actual)

module.exports = app;