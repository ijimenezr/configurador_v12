import { cargarDatos, cargarInformeCurso, generarBiblioTextArea, selectReiniciar } from "./componentes.mjs";

// MENÚ LATERAL DE OPCIONES
export default function (configuracionCurso) {
      $('.content-bottom').find('.btn').on('mousedown', (e) => e.preventDefault());

      const formulario = $('#form-configuracion');
      let config = {};

      // Limpiar el formulario
      $('#limpiar').on('click', () => {
            formulario.find('input[type=text], input[type=number]').val('');
            $('#unidad-1-apartado-1').val('Introducción')
            // Eliminar todas las unidades con sus apartados correspondientes
            configuracionCurso.find('#unidades').find('.unidad:not(#ud-1)').remove();
            configuracionCurso.find('#ud-1').find('.apartados').find('.apartado:not(:first-child)').remove();
            configuracionCurso.find('.biblio-glosa').find('.bibliografias').remove()
            configuracionCurso.find('.biblio-glosa').find('.anadir_biblio').trigger('click')
            configuracionCurso.find('.biblio-glosa').find('#content_loadBiblio a[data-toggle="collapse"].click').trigger('click')
            configuracionCurso.find('.biblio-glosa').find('textarea').remove();
            configuracionCurso.find('.biblio-glosa').find('#b_editGlosa').addClass('ocultar');
            selectReiniciar();

            // Desactivar el botón genear scorm
            $('#generar-scorm').attr('disabled', 'disabled');
      });

      // Cargar cursos anteriores
      $('#cargarCursos').on('click', (e) => {
            const contenido = getIndexedDBAll()
            $('body').addClass('cargarCursosClick')
            $('body').find('.pantallaEmergente').remove()
            $('body').append(`<div class="pantallaEmergente"><div><div class="titulo"><h2>Cargar cursos</h2><button type="button" class="close" data-dismiss="modal" aria-label="Cerrar ventana"><span aria-hidden="true">×</span></button></div><div class="listaCursos"><ul><li class="li_guia"><p>Fecha</p><p>Título</p></li></ul></div></div></div>`)

            contenido.getAll().onsuccess = event => {
                  const resultado = event.currentTarget.result;
                  resultado.length > 10 && eliminarIndexDB(resultado, contenido);
                  for (const key in resultado) $('.pantallaEmergente').find('ul .li_guia').after(`<li id="${resultado[key].id}"><p>${resultado[key].fecha}</p><p>${resultado[key].titulo}</p><button type="button" class="btn btn-primary eliminarConfig" title="Eliminar config de ${resultado[key].titulo}" data-toggle="tooltip" data-placement="right"><i class="fas fa-trash"></i></button></li>`)

                  $('.pantallaEmergente').find('ul li').on('click', e => {
                        let datos = seleccionarIndexDB(e.currentTarget.id)
                        datos.onsuccess = event => {
                              if (datos.result !== undefined) {
                                    let data = event.currentTarget.result;
                                    cargarDatos(data.datos)
                                    $('body').find('.pantallaEmergente').remove()
                                    $('body').removeClass('cargarCursosClick')
                              }
                        }
                        datos.onerror = e => console.log("ERROR - error al cargar config: " + e);
                  });
                  $('.pantallaEmergente').find('ul .eliminarConfig').on('click', e => eliminarSelected(parseInt($(e.currentTarget).parent().attr('id'))))
            }
            contenido.getAll().onerror = e => console.log("ERROR - error cargando cursos anteriores: " + e);

            $('.pantallaEmergente').find('.close').on('click', () => {
                  $('body').find('.pantallaEmergente').remove()
                  $('body').removeClass('cargarCursosClick')
            })
      });

      // Ir al principio
      $('#ir-principio').on('click', () => $('html,body').animate({ scrollTop: 0 }, 1000));

      // Enviar datos de formulario
      formulario.on('submit', function (e) {
            e.preventDefault();
            $('#collapseExample .note-editor.note-frame.panel.panel-default.codeview').find('.btn-codeview').trigger('click')
            generarBiblioTextArea()

            // Verificar que todos los campos estan completados
            let enviar = true;
            $(this).find('input[type=text]').each((index, element) => {
                  if (element.value === '' && !$(element).parents('.modal-body').length) {
                        enviar = false;
                        return false;
                  }
            });

            // Generar curso
            if (enviar) {
                  console.log($(this).attr('action'), $(this).attr('method'))
                  const url = $(this).attr('action');
                  const method = $(this).attr('method');
                  // console.log($(this).serialize())
                  $.ajax({
                        url: url,
                        method: method,
                        data: $(this).serialize(),
                        complete: function () {
                              console.log("Proceso de generar curso completado.");
                        },
                        success: function (respuesta) {
                              $('#modal-descargar-curso').modal('show');
                              cargarInformeCurso(respuesta.config)
                              $('#descargar-curso').attr('href', `/descargarCurso/${respuesta.titulo}`);
                              $('#generar-scorm').removeAttr('disabled');
                              console.log(`El curso "${respuesta.titulo}" ha sido generado con éxito.`);
                              config = respuesta.config;
                              // console.log(respuesta)
                              setIndexedDB(config)
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                              console.log("Error al generar el curso.");
                        }
                  });
            }
      });

      // Generar scorm
      $('#generar-scorm').on('click', () => {
            const url = "/scorm";
            const method = "POST";

            $.ajax({
                  url: url,
                  method: method,
                  dataType: "json",
                  contentType: "application/json",
                  data: JSON.stringify(config),
                  complete: function () {
                        console.log("Proceso de generar scorm completado.");
                  },
                  success: function (respuesta) {
                        const modal = $('#modal-descargar-scorm');
                        modal.find('.modal-content').find('.modal-body').find('ul').empty();
                        for (let i = 1; i <= Object.keys(config.unidades).length; i++)
                              modal.find('.modal-content').find('.modal-body').find('ul').append(`<li><a href="/descargarScorm/ud${i}" class="btn btn-link"><i class="fas fa-file-archive"></i> Descargar paquete SCORM de la unidad ${i}</a></li>`);

                        // Bibliografía
                        if (config.biblio)
                              modal.find('.modal-content').find('.modal-body').find('ul').append(`<li><a href="/descargarScorm/bibliografia" class="btn btn-link"><i class="fas fa-file-archive"></i> Descargar paquete SCORM de la bibliografía</a></li>`);

                        // Glosario
                        if (config.glosario)
                              modal.find('.modal-content').find('.modal-body').find('ul').append(`<li><a href="/descargarScorm/glosario" class="btn btn-link"><i class="fas fa-file-archive"></i> Descargar paquete SCORM del glosario</a></li>`);

                        // Ejercicios de evaluación final
                        for (let i = 1; i <= config.numTest; i++) {
                              const numEv = i + Object.keys(config.unidades).length;
                              modal.find('.modal-content').find('.modal-body').find('ul').append(`<li><a href="/descargarScorm/ev${numEv}" class="btn btn-link"><i class="fas fa-file-archive"></i> Descargar paquete SCORM de la evaluación final ${i}</a></li>`);
                        }

                        modal.modal('show');

                        console.log(`El paquete scorm del curso "${respuesta.titulo}" ha sido generado con éxito.`);
                  },
                  error: function (jqXHR, textStatus, errorThrown) {
                        console.log("No se ha podido generar los paquetes scorm.");
                  }
            });
      });

      // Cargar archivo de configuración
      $('#cargar-config').on('click', function () {
            $(this).next('input[type="file"]').trigger('click');
      });

      // Leer el contenido del archivo
      $('#input-file-config').on('change', function (e) {
            // Eliminar todas las unidades con sus apartados correspondientes
            configuracionCurso.find('#unidades').find('.unidad:not(#ud-1)').remove();
            configuracionCurso.find('#ud-1').find('.apartados').find('.apartado:not(:first-child)').remove();

            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.readAsText(file);

            // Pintar el contenido del archivo en el formulario
            reader.onload = (e) => {
                  $('#input-file-config').val("");
                  config = JSON.parse(e.target.result);
                  cargarDatos(config)
            };
      });

      // Activar el autoguardado en el almacen de objetos del navegador con IndexedDB
      setInterval(() => {
            // Verificar que todos los campos estan completados
            let enviar = true;
            $(formulario).find('input[type=text]').each((index, element) => {
                  if (element.value === '') {
                        enviar = false;
                        return false;
                  }
            });

            // Generar config para autoguardado
            if (enviar) {
                  const url = '/autoguardado';
                  const method = $(formulario).attr('method');
                  $.ajax({
                        url: url,
                        method: method,
                        data: $(formulario).serialize(),
                        complete: function () { console.log("Proceso de generar curso completado.") },
                        success: function (respuesta) { setIndexedDB(respuesta.config) },
                        error: function () { console.log("Error al generar el curso.") }
                  });
            }
      }, 18000);
}
