const fs = require('fs');
const fse = require('fs-extra');
const util = require('util');
const { destinationCourse } = require('../config/variables');
const variables = require('../config/variables');
const { setEjercicios } = require("./Utilidades");
let titulo;

function crearCurso(req, res) {
      // Eliminar todos los zip existentes en el directorio de cursos
      fs.readdirSync(variables.dirCourse).forEach(file => {
            if (file.includes('zip'))
                  fs.unlinkSync(variables.dirCourse + file);
      });

      const datos = req.body;
      const config = {};
      let unidad = 0;

      config.version = "12";

      let apartado = ''
      let nomApartado = ''
      for (const key in datos) {
            if (!key.toLowerCase().includes("subapartado")) {
                  apartado = key.replace(`unidad-${unidad}-apartado-`, "");
                  // Nombre del fichero del apartado
                  nomApartado = nombreApartado(unidad, apartado);
                  if (key.toLowerCase().includes("apartado")) {
                        if (config.unidades[unidad].apartados === undefined) config.unidades[unidad].apartados = {};
                        config.unidades[unidad].apartados[nomApartado] = {apartado: datos[key]};
                  } else if (key.toLowerCase().includes("unidad")) {
                        unidad = key.replace("unidad-", "");

                        // Unidad
                        if (config.unidades === undefined) config.unidades = {};
                        config.unidades[unidad] = { titulo: datos[key] };

                        // Ejercicios de autevaluación
                        if (datos[`ejercicios-${unidad}`])
                              config.unidades[unidad].ejercicios = true;
                        else
                              config.unidades[unidad].ejercicios = false;

                        delete datos[`ejercicios-${unidad}`];
                  } else if (key.toLowerCase().includes("biblio"))
                        datos['check-biblio'] ? config.biblio = true : config.biblio = false;
                  else if (key.toLowerCase().includes("glosario"))
                        (datos['check-glosario']) ? config.glosario = true : config.glosario = false;
                  else config[key] = datos[key];
            } else {
                  if (config.unidades[unidad].apartados[nomApartado].subapartados === undefined) config.unidades[unidad].apartados[nomApartado].subapartados = {};
                  config.unidades[unidad].apartados[nomApartado].subapartados[key] = datos[key];
            }
      }

      // Título - Se reemplaza los espacios por guines bajos, se eliminan las tildes y se convierte todo a minúscula
      titulo = config.tituloCurso.replace(/\s/g, "_").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

      // Eliminar la carpeta para volver a crear un curso
      fse.emptyDir(variables.destinationCourse)
            .then(() => {
                  // Crear los ficheros necesarios del curso
                  const promesasCopia = [];

                  // Crear carpetas que no llevan contenido
                  const folderCreate = ['animaciones', 'audios', 'css', 'descargas', 'documentos', 'imagenes/contenidos', 'imagenes/portadas', 'videos', 'js', 'config'];
                  folderCreate.forEach(element => promesasCopia.push(fse.ensureDir(variables.destinationCourse + element)));

                  // Copiar las carpetas que tienen contenido
                  const folderCopy = ['config', 'js']
                  folderCopy.forEach(element => promesasCopia.push(fse.copy(variables.originCourse + element, variables.destinationCourse + element)));

                  return Promise.all(promesasCopia);
            })
            .then(() => {
                  // Crear el fichero de configuración
                  return fse.writeJson(variables.fileConfigCourse, config);
            })
            .then(result => {
                  // Crear los apartados, ejercicios de autoevaluación, las evaluaciones finales, bibliografía y glosario
                  const sourceIntro = `${variables.originCourse}introduccion.html`;
                  const source = `${variables.originCourse}apartado.html`;
                  const unidades = config.unidades;
                  const promesas = [];
                  const writeFile = util.promisify(fs.writeFile);

                  // Apartados unidad-1-apartado-1
                  for (const keyUnidad in unidades) {
                        const apartados = unidades[keyUnidad].apartados;
                        let apartado = 1
                        for (const keyApartado in apartados) {
                              const destination = `${variables.destinationCourse}${keyApartado}.html`;
                              datos[`unidad-${keyUnidad}-apartado-${apartado}`] == 'Introducción' ? promesas.push(fse.copy(sourceIntro, destination)) : promesas.push(fse.copy(source, destination))
                              apartado++
                        }
                        // Ejercicios de autoevaluación
                        if (unidades[keyUnidad].ejercicios) {
                              const num = Object.keys(apartados).length + 1;
                              const nomApartado = nombreApartado(keyUnidad, num);
                              const destination = `${variables.destinationCourse}${nomApartado}.html`;
                              const ejercicios = setEjercicios();
                              promesas.push(writeFile(destination, ejercicios));
                        }
                  }

                  // Ejercicios de evaluación final
                  const num = config.numTest;
                  for (let i = 1; i <= num; i++) {
                        const totalUnidades = Object.keys(unidades).length + i;
                        const numEv = (totalUnidades < 9) ? '0' + totalUnidades : totalUnidades;
                        const nomEvaluacion = `ap01${numEv}0101`;
                        const destination = `${destinationCourse}${nomEvaluacion}.html`;
                        const ejercicios = setEjercicios("global", i);
                        promesas.push(writeFile(destination, ejercicios));
                  }

                  // Bibliografía
                  if (config.biblio)
                        promesas.push(fse.copy(`${variables.originCourse}bibliografia.html`, `${variables.destinationCourse}bibliografia.html`));

                  // Glosario
                  if (config.glosario)
                        promesas.push(fse.copy(`${variables.originCourse}glosario.html`, `${variables.destinationCourse}glosario.html`));

                  return Promise.all(promesas);
            })
            .then(() => {
                  // Crear el zip de las unidades
                  const Zipit = require('zipit');
                  Zipit({
                        input: [variables.destinationCourse],
                        cwd: process.cwd()
                  }, (err, buffer) => {
                        if (!err)
                              return new Promise((resolve, reject) => {
                                    fs.writeFile(`${variables.dirCourse}${titulo}.zip`, buffer, (err, data) => {
                                          if (err) reject(err);
                                          resolve();
                                    })
                              })
                  });
            })
            .then(result => res.send({ titulo, config }))
            .catch((error) => { console.log(error); res.status(404).send(error) })
}

function nombreApartado(unidad, apartado) {
      const numUnidad = (unidad > 9) ? unidad : "0" + unidad;
      const numApartado = (apartado > 9) ? apartado : "0" + apartado;
      return "ap01" + numUnidad + numApartado + "01";
}

module.exports = { crearCurso };
