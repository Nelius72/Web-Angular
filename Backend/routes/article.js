'use strict'

//Cargamos los diferentes módulos como express, router y multiparty
var express = require('express');
var ArticleController = require ('../controllers/article');

var router = express.Router();

var multiparty = require ('connect-multiparty');
var middleware_upload = multiparty({uploadDir: './upload/articles'});

//Rutas de prueba
router.get('/test-de-controlador', ArticleController.test);
router.post('/datos-curso', ArticleController.datosCurso);

//Rutas (útiles) para artículos

router.post('/save', ArticleController.save);
router.post('/articles/:last?', ArticleController.getArticles); //el last es un parámetro opcional
router.get('/article/:id', ArticleController.getArticle); //id es parámetro obligatorio
router.put('/article/:id', ArticleController.update); //Usamos el .put para actualizar
router.delete('/article/:id',ArticleController.delete); //Eliminamos artículo
router.post('/upload-image/:id', middleware_upload, ArticleController.upload); //Subir imágenes, para ello cargamos el middleware también
router.get('/get-image/:image', ArticleController.getImage); //Sacamos imagenes del backend
router.get('/search/:search', ArticleController.search); //Buscador de artículos

module.exports = router;