'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3900;

mongoose.Promise = global.Promise;
//Cuando nos conectemos a mongoose se va a llevar a cabo una promesa y va a realizar la función contenida en esa promesa
mongoose.connect('mongodb://localhost:27017/api_rest_blog') //base de datos: dirección / nombre bbdd
        .then(() => {
              console.log('Conexión realizada con éxito');

              //Crear servidor y escuchar peticiones http
              app.listen(port, () => {
                console.log('Servidor funcionando en http://localhost:'+port);
              });
});