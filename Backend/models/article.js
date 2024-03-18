'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = Schema({

    title: String,
    content: String,
    date: {type: Date, default: Date.now},
    image: String
})

module.exports = mongoose.model('Article', ArticleSchema); //Nombre del modelo y el esquema que va a seguir.
//mongoose va a crear una colección articles --> y guarda documentos de este tipo y con esta estructura dentro de la colección.