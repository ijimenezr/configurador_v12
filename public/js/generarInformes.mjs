function generarInformeACAP(event) {
      // Reiniciar valores del data
      let informe = {}
      informe.totalRecursos = {
            totalAP: 0,
            totalAC: 0,
            totalACTP: 0,
            totalACT: 0,
            totalCDU: 0
      };
      informe.activeRecursos = {
            activeAC: false,
            activeAP: false,
            activeACTP: false,
            activeACT: false,
            activeCDU: false
      };
      informe.contenidos = [];
      informe.allImages = [];
      informe.tituloCurso = "";
      informe.tipoActividad = {};

      const allFiles = event.target.files;
      let promesas = [];

      for (const key in allFiles) {
            const file = allFiles[key];

            // Extraer todas las imágenes del curso que se encuentran en la carpeta [manual, graficos, actividades] y añadirlas al array allImages
            const fileTypeImg = ["image/jpeg", "image/png", "image/svg+xml", "image/jpg"];
            (fileTypeImg.includes(file.type) && (file.webkitRelativePath.includes("contenidos") || file.webkitRelativePath.includes("portadas") || file.webkitRelativePath.includes("videos"))) && informe.allImages.push(file);

            // Identificar que es un fichero HTML
            if (file.type === "text/html") {
                  let promise = new Promise(resolve => {
                        // Leer el contenido del fichero
                        const reader = new FileReader();
                        reader.readAsText(file, "UTF-8");
                        reader.onload = content => {

                              // Convertir en HTML
                              const contenido = content.target.result;
                              const parser = new DOMParser();
                              const contenidoHTML = parser.parseFromString(contenido, 'text/html');

                              if (file.name.includes("solucionario")) this.solucionario(contenidoHTML); // Obtener las soluciones
                              else obtenerApAc(contenidoHTML, file.name, informe); // Pintar aplicaciones prácticas y actividades colaborativas

                              resolve(true)
                        }
                  })
                  promesas.push(promise);
            }
      }

      // Leer el fichero de configuración y obtener el título del curso
      let promiseTituloCurso;
      Object.values(allFiles).find(file => {
            if (file.name.includes("config")) {
                  promiseTituloCurso = new Promise(resolve => {
                        const reader = new FileReader();
                        reader.readAsText(file, "UTF-8");
                        reader.onload = content => {
                              let contenido = content.target.result.split('\n');
                              const datosConfig = JSON.parse(contenido[0]);
                              informe.tituloCurso = datosConfig.tituloCurso
                              resolve(true);
                        }
                  })
                  return true;
            }
      });
      promesas.push(promiseTituloCurso);
      Promise.all(promesas).finally(() => { rellenarInforme(informe) });
}

const rellenarInforme = (informe) => {
      $('#pantallaInformes').find('#principal_generador .datos-curso .titulo').text(informe.tituloCurso)
      $('#pantallaInformes').find('#principal_generador .badge.ap').text(`${informe.totalRecursos.totalAP} Aplicación práctica`)
      $('#pantallaInformes').find('#principal_generador .badge.ac').text(`${informe.totalRecursos.totalAC} Actividad colaborativa`)
      $('#pantallaInformes').find('#principal_generador .badge.actp').text(`${informe.totalRecursos.totalACTP} Actividad práctica`)
      $('#pantallaInformes').find('#principal_generador .badge.act').text(`${informe.totalRecursos.totalACT} Actividades`)
      $('#pantallaInformes').find('#principal_generador .badge.cdu').text(`${informe.totalRecursos.totalCDU} Caso de uso`)
      informe.contenidos.forEach((element, index) => {
            $('#pantallaInformes').find('#informe').append(`<div class="unidad_informe" id="unidad_${index}"><h4 class="numUd">Unidad ${index}</h4></div>`)
            element.forEach((act, i) => {
                  const nombre = act.titulo.includes('aplicacionpractica') ? `Aplicación práctica ${i + 1}`
                        : (act.titulo.includes('actividad_colaborativa')) ? `Actividad colaborativa ${i + 1}`
                              : (act.titulo.includes('actividadpractica')) ? `Actividad práctica ${i + 1}`
                                    : (act.titulo.includes('casodeuso')) ? `Caso de uso ${i + 1}`
                                          : `Actividad ${i + 1}`;
                  $('#pantallaInformes').find('#informe #unidad_' + index).append(`<section id="${act.id}"><h4 class="titulo">${nombre}</h4><div class="contenido-html">${act.html}</div></section>`)
            })
      });
}

const obtenerApAc = (contenido, nameFile, informe) => {
      // Obtener el contenido de las aplicaciones prácticas y las actividades colaborativas
      const allAPAC = contenido.querySelectorAll('.recurso[data-tipo="aplicacionpractica"], .actividad_colaborativa, .recurso[data-tipo="actividadpractica"], .recurso_competencia, .recurso[data-tipo="casodeuso"]');

      // Leer el contenido de las aplicaciones prácticas y las actividades colaborativas
      allAPAC.forEach((element, index) => {
            const titulo = element.getAttribute('data-tipo') !== null ? element.getAttribute('data-tipo') : element.getAttribute('class');   // Obtener el título
            // const tipo = titulo.includes('práctica') ? 'ap' : 'ac';     // Obtener el tipo

            // Obtener el tipo
            const tipo = titulo.includes('aplicacionpractica') ? 'ap'
                  : (titulo.includes('actividad_colaborativa')) ? 'ac'
                        : (titulo.includes('actividadpractica')) ? 'actp'
                              : (titulo.includes('casodeuso')) ? 'cdu'
                                    : 'act';

            // Eliminar la instrucción de las aplicaciones prácticas
            (tipo === "ap" && element.querySelector('p:last-child') !== null && element.querySelector('p:last-child').innerHTML.includes('Las instrucciones')) && element.querySelector('p:last-child').remove(1);

            // Buscar las imágenes del contenido principal
            const allImg = element.querySelectorAll('img');

            // Si existen imágenes pintarlas en base64
            (allImg.length > 0) && utilidades.pintarImagen(allImg, this.allImages);

            // Buscar audios en el contenido principal
            const allAudio = element.querySelectorAll('audio');

            // Si existen interactivos incorporar un texto informativo
            let interacciones = element.querySelectorAll('.interaccion');
            interacciones.forEach(interaccion => {
                  let nuevoNodo = document.createElement('p');
                  nuevoNodo.classList.add('info-interaccion');
                  nuevoNodo.innerHTML = '<img src="public/images/interactivo.svg" style="width: 1rem;">Existe una interacción en esta tarea';
                  interaccion.parentNode.insertBefore(nuevoNodo, interaccion.nextSibling);
                  interaccion.remove();
            });

            // Si existen audios incorporar un texto informativo
            allAudio.forEach(audio => {
                  let nuevoNodo = document.createElement('p');
                  nuevoNodo.classList.add('info-audio');
                  nuevoNodo.innerHTML = "Existe un audio en esta actividad";
                  audio.parentNode.insertBefore(nuevoNodo, audio.nextSibling);
            });

            // Actualizar el total de actividades y aplicaciones (badge)
            switch (tipo) {
                  case "ap":
                        informe.totalRecursos.totalAP++;
                        break;
                  case "ac":
                        informe.totalRecursos.totalAC++;
                        break;
                  case "actp":
                        informe.totalRecursos.totalACTP++;
                        break;
                  case "act":
                        informe.totalRecursos.totalACT++;
                        break
                  case "cdu":
                        informe.totalRecursos.totalCDU++;
            }

            // Eliminar el texto Ver solución
            const contenido = element.innerHTML.replace('Ver solución', "<h5>Solución:</h5>");

            // Guardar el contenido en el array contenidos para pintarlo de forma reactiva en el DOM
            let ud = nameFile.substring(4, 6);
            let ap = nameFile.substring(6, 8);
            let ind = (index > 9) ? index : "0" + index; // Se utiliza para mostrar en orden las AP y AC
            let id = ud.toString() + ap.toString() + ind.toString();
            id = parseInt(id);
            ud = parseInt(ud);
            if (informe.contenidos[ud] === undefined) informe.contenidos[ud] = [];
            informe.contenidos[ud].push({
                  id: id,
                  titulo: titulo,
                  tipo: tipo,
                  html: contenido
            });
      });
}

function generarInformeTE(event) {console.log('te')
      // Reiniciar valores del data
      let informe = {}
      informe.totalTE = 0;
      informe.contenidos = [];
      informe.allImages = [];
      informe.tituloCurso = "";
      informe.evaluacion = [];
      informe.capcidades = [];

      const allFiles = event.target.files;
      let promesas = [];

      // Extraer todas las imágenes del curso que se encuentran en la carpeta [manual, graficos, actividades] y añadirlas al array allImages
      for (const key in allFiles) {
            const file = allFiles[key];
            const fileTypeImg = ["image/jpeg", "image/png", "image/svg+xml", "image/jpg"];
            (fileTypeImg.includes(file.type) && (file.webkitRelativePath.includes("manual") || file.webkitRelativePath.includes("graficos") || file.webkitRelativePath.includes("actividades"))) && informe.allImages.push(file);
      }

      // Leer el fichero de configuración, obtener el título del curso y las tareas de evaluación
      const fileConfig = Object.values(allFiles).find((file) => file.name.includes("config"));
      new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsText(fileConfig, "UTF-8");
            reader.onload = content => {
                  const contenido = content.target.result.split('\n');
                  console.log(contenido)
                  const datosConfig = JSON.parse(contenido[0]);
                  console.log(datosConfig)
                  informe.tituloCurso = datosConfig.tituloCurso
                  informe.evaluacion = JSON.parse(contenido[6]);
                  informe.capacidades = JSON.parse(contenido[1]);
                  resolve(true);
            }
            reader.onerror = error => reject(new Error(error));
      }).then(() => promesas.push(obtenerTarea(allFiles))).catch((error) => console.error(error));
      Promise.all(promesas).finally(() => console.log(promesas));
}

function obtenerTarea(allFiles) {
      this.evaluacion.forEach((element, index) => {
            if (element[2] === "tarea") {
                  const apartado = `ap01${element[0]}.html`;
                  const fileTarea = Object.values(allFiles).find((file) => file.name == apartado);

                  // Abrir el html y obtener el enunciado
                  let promise = new Promise(resolve => {
                        const reader = new FileReader();
                        reader.readAsText(fileTarea, "UTF-8");
                        reader.onload = content => {

                              // Convertir en HTML
                              const contenido = content.target.result;
                              const parser = new DOMParser();
                              const contenidoHTML = parser.parseFromString(contenido, 'text/html');

                              // Criterios
                              let criterios = [];
                              element[6].forEach(criterio => {
                                    let textoCriterio = criterio[0];
                                    if (criterio[0] === true) textoCriterio += "parcial";
                                    criterios.push(textoCriterio);
                              });

                              // Objetivos
                              let objetivos = [];
                              criterios.forEach(criterio => {
                                    this.capacidades.forEach(capacidad => {
                                          if (capacidad[2] === criterio) objetivos.push(capacidad[3]);
                                    });
                              })

                              // Buscar las imágenes del contenido principal
                              const allImg = contenidoHTML.querySelectorAll('img');
                              // Si existen imágenes pintarlas en base64
                              (allImg.length > 0) && utilidades.pintarImagen(allImg, this.allImages);

                              // Actualizar el total de actividades y tareas (badge)
                              this.totalTE++;

                              let ud = element[0].substring(0, 2);
                              const ap = element[0].substring(2, 4);
                              let id = ud.toString() + ap.toString() + index.toString();
                              id = parseInt(id);
                              ud = parseInt(ud);

                              // Si existen interactivos incorporar un texto informativo
                              let interacciones = contenidoHTML.querySelectorAll('.interaccion');
                              interacciones.forEach(interaccion => {
                                    let nuevoNodo = document.createElement('p');
                                    nuevoNodo.classList.add('info-interaccion');
                                    nuevoNodo.innerHTML = '<img src="public/images/interactivo.svg" style="width: 1rem;">Existe una interacción en esta tarea';
                                    interaccion.parentNode.insertBefore(nuevoNodo, interaccion.nextSibling);
                                    interaccion.remove();
                              });

                              if (this.contenidos[ud] === undefined) this.contenidos[ud] = [];
                              this.contenidos[ud].push({
                                    id: id,
                                    titulo: `Tarea de evaluación ${element[1]} (${element[5]})`,
                                    html: contenidoHTML.querySelector('#iyc_container_screen section .row').innerHTML,
                                    criterios: criterios,
                                    colaborativa: element[3],
                                    presencial: element[4],
                                    objetivos: objetivos
                              });
                              resolve(true);
                        }
                  })
                  return promise;
            }
      })
}

export {generarInformeACAP, generarInformeTE}