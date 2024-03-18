"use strict";
//Cargamos módulos de NodeJs
var validator = require("validator");
var filesystem = require("fs"); //Modulo para gestionar archivos
var path = require("path");

var Article = require("../models/article");

var controller = {
  ////////////////////////////MÉTODOS DE PRUEBA.//////////////////////////////////////////

  datosCurso: (req, res) => {
    console.log(req.body); //Aquí lo que estamos haciendo es enviando un mensaje a través del cliente, en este caso
    var hola = req.body.hola; // para los post se hace a través de POSTMAN, en el mismo en body ponemos el json y hacemos la peticion
    return res.status(200).send({
      // y al hacer el post se muestra por consola el mensaje.
      curso: "Master Frameworks Javascript",
      autor: "Cornelio Romero Borrero",
      iduser: "@nelius72",
      hola,
    });
  },

  test: (req, res) => {
    return res.status(200).send({
      message: "Soy la acción test del controlador de artículos",
    });
  },

  ////////////////////////////MÉTODO PARA GUARDAR ARTÍCULOS.//////////////////////////////////////////

  //Async significa que la función siempre devuelve una promesa.
  //Dentro de una función asíncrona, puedes utilizar la palabra clave await para esperar que otras promesas se resuelvan.
  save: async (req, res) => {
    // Recogemos parámetros por post
    var parametros = req.body;

    try {
      // Validamos datos (a través de la librería validator) por si falta alguno
      var validate_title = !validator.isEmpty(parametros.title);
      var validate_content = !validator.isEmpty(parametros.content);

      if (!validate_title || !validate_content) {
        throw new Error("Faltan datos por enviar!!!");
      }

      // Crear el objeto a guardar
      var article = new Article();

      // Asignar valores
      article.title = parametros.title;
      article.content = parametros.content;

      if(article.image){
        article.image = parametros.image;
      }else{
        article.image = null;
      }
     

      // Guardar el artículo
      // await article.save(). Esta línea espera a que la operación de guardado se complete antes de continuar con la ejecución del código.
      const articleStored = await article.save();

      // Devolvemos respuesta
      return res.status(200).send({
        status: "success",
        article: articleStored,
      });
    } catch (error) {
      return res.status(200).send({
        status: "error",
        message: error.message || "Error al guardar el artículo",
      });
    }
  },

  ////////////////////////////MÉTODO PARA CARGAR TODOS LOS ARTÍCULOS DE LA BBDD.//////////////////////////////////////////

  //Actualizado para que solo muestre los 5 últimos en caso de param opcional
  /*El método exec() de Mongoose ya no acepta un callback como argumento. 
En versiones recientes de Mongoose, exec() ahora devuelve una promesa en lugar de aceptar un callback.*/
  getArticles: (req, res) => {
    // Find
    var query = Article.find({});

    var last = req.params.last;
    if (last || last != undefined) {
      //Si a la hora de hacer el GET hay un parámetro opcional, se limita el resultado a 5 elementos

      query.limit(5);
    }

    query
      .sort("-date")
      .exec() //Con .sort('') vamos a poder ordenar el resultado en función al dato que se desee. - es descendente
      .then((articles) => {
        //articles lo podemos cambiar por el nombre que guste. Es el nombre del array que va a devolver
        if (articles.length === 0) {
          return res.status(404).send({
            status: "error",
            message: "No hay artículos para mostrar!!!",
          });
        }
        return res.status(200).send({
          status: "success",
          articles,
        });
      })
      .catch((err) => {
        return res.status(500).send({
          status: "error",
          message: "Error al devolver los artículos!!!",
          error: err.message,
        });
      });
  },

  ////////////////////////////MÉTODO PARA OBTENER UN ÚNICO ARTÍCULO.//////////////////////////////////////////

  getArticle: (req, res) => {
    //Recoger id de url
    var articleId = req.params.id;
    //Comprobar validez
    if (!articleId || articleId == null) {
      return res.status(404).send({
        status: "error",
        message: "No existe el artículo!!!",
      });
    }
    //Buscar el artículo
    Article.findById(articleId)
      .then((article) => {
        //Devolverlo en json
        return res.status(200).send({
          status: "success",
          article,
        });
      })
      .catch((err) => {
        return res.status(404).send({
          status: "error",
          message: "No existe el artículo!!!",
          error: err.message,
        });
      });
  },

  ////////////////////////////MÉTODO PARA ACTUALIZAR ARTÍCULOS.//////////////////////////////////////////

  update: (req, res) => {
    //Recoger id del artículo por url
    var articleId = req.params.id;

    //Recoger los datos por put
    var params = req.body;
    //Validación de datos
    try {
      // Validamos datos (a través de la librería validator) por si falta alguno
      var validate_title = !validator.isEmpty(params.title);
      var validate_content = !validator.isEmpty(params.content);

      if (validate_title || validate_content) {
        //Find and update
        Article.findOneAndUpdate({ _id: articleId }, params, { new: true }) //Pasamos el elemento para encontrar(id), luego datos a actualizar y new true para que te devuelva el nuevo artículo actualizado
          .then((articleUpdated) => {
            //Devolverlo en json
            return res.status(200).send({
              status: "success",
              article: articleUpdated,
            });
          })
          .catch((err) => {
            return res.status(404).send({
              status: "error",
              message: "No se ha actualizado el artículo!!!",
              error: err.message,
            });
          });
      } else {
        throw new Error("Validación incorrecta!!!");
      }
    } catch (error) {
      return res.status(404).send({
        status: "error",
        message: "Faltan datos por enviar!!!",
      });
    }
  },

  ////////////////////////////MÉTODO PARA ELIMINAR ARTÍCULOS.//////////////////////////////////////////

  delete: (req, res) => {
    //Recoger id del artículo por url
    var articleId = req.params.id;

    //Validación de datos, find and delete

    Article.findOneAndDelete({ _id: articleId }) //Pasamos el elemento para encontrar(id) y eliminarlo
      .then((articleRemoved) => {
        //Devolverlo en json
        return res.status(200).send({
          status: "success",
          message: `ARTÍCULO ${articleId} ELIMINADO DE LA BBDD`, //Ojo al tipo de comillas
          article: articleRemoved,
        });
      })
      .catch((err) => {
        return res.status(404).send({
          status: "error",
          message:
            "No se proporcionó un ID de artículo válido para eliminar!!!",
          error: err.message,
        });
      });
  },

  ////////////////////////////MÉTODO PARA GUARDAR IMÁGENES (UPLOAD).//////////////////////////////////////////

  upload: (req, res) => {
    //Configuramos el módulo multiparty en el apartado de routes.

    //Recogemos fichero de la petición
    var filename = "No se pudo subir la imagen!!!";

    console.log(req.files);
    if (!req.files || !req.files.file0) {
      return res.status(404).send({
        status: "error",
        message: filename,
      });
    }

    //Conseguimos el nombre y la extensión del archivo
    var file_path = req.files.file0.path;
    var file_split = file_path.split("\\");
    var file_name = file_split[2]; //Nombre para guardarlo en la BBDD
    var extension_split = file_name.split(".");
    var file_ext = extension_split[1]; //Extensión para comprobar el tipo de archivo.
    //console.log();
    //Comprobamos la extensión (solo imagenes y si no es valido borrar el fichero
    if (
      file_ext != "png" &&
      file_ext != "jpg" &&
      file_ext != "jpeg" &&
      file_ext != "gif"
    ) {
      //Borramos el archivo subido
      filesystem.unlink(file_path, (err) => {
        return res.status(500).send({
          status: "error",
          message: "La extensión del archivo no es válida!!",
        });
      });
    } else {
      //Si todo es válido buscamos el artículo, le asignamos el nombre de la imagen y lo actualizamos
      var articleId = req.params.id;
      Article.findOneAndUpdate(
        { _id: articleId },
        { image: file_name },
        { new: true }
      )
        .then((articleUpdated) => {
          //Devolverlo en json
          return res.status(200).send({
            status: "success",
            article: articleUpdated,
          });
        })
        .catch((err) => {
          return res.status(404).send({
            status: "error",
            message: "No se ha actualizado la imagen del artículo!!!",
            error: err.message,
          });
        });
    }
  },

  ///////////////////////////// MÉTODO PARA SACAR IMÁGENES DEL BACKEND ///////////////////////////////////////////

  getImage: (req, res) => {
    var file = req.params.image;
    var file_path = "./upload/articles/" + file;
    filesystem.stat(file_path, (err, stats) => {
      if (!err && stats.isFile) {
        return res.sendFile(path.resolve(file_path));
      } else {
        return res.status(404).send({
          status: "error",
          messagge: "La imagen no existe!!!",
        });
      }
    });
  },

  //////////////////////////////// MÉTODO PARA BUSCAR ARTÍCULOS //////////////////////////////////////////

  search: (req, res) => {
    var busqueda = req.params.search;
    // Find

    Article.find({
      $or: [//Condición a usar
        { title: { $regex: busqueda, $options: "i" } }, //Si el contenido de búsqueda está incluido (i) en title o content me devuelve los articulos coincidentes
        { content: { $regex: busqueda, $options: "i" } },
      ],
    }).sort("-date")
      .exec() //Con .sort('') vamos a poder ordenar el resultado en función al dato que se desee. - es descendente
      .then((articles) => {
        //articles lo podemos cambiar por el nombre que guste. Es el nombre del array que va a devolver
        if (!articles || articles.length === 0) {
          return res.status(404).send({
            status: "error",
            message: "No hay artículos para mostrar!!!",
          });
        }
        return res.status(200).send({
          status: "success",
          articles,
        });
      })
      
  },
}; // Fin del controlador

module.exports = controller;
