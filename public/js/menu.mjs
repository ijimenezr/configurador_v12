import { selectReiniciar } from "./componentes.mjs";

// MENÚ LATERAL DE OPCIONES
export default function (configuracionCurso) {
      $('.content-bottom').find('.btn').on('mousedown', (e) => e.preventDefault());

      const formulario = $('#form-configuracion');
      let config = {};

      // Limpiar el formulario
      $('#limpiar').on('click', () => {
            formulario.find('input[type=text], input[type=number]').val('');
            // Eliminar todas las unidades con sus apartados correspondientes
            configuracionCurso.find('#unidades').find('.unidad:not(#ud-1)').remove();
            configuracionCurso.find('#ud-1').find('.apartados').find('.apartado:not(:first-child)').remove();
            selectReiniciar();

            // Desactivar el botón genear scorm
            $('#generar-scorm').attr('disabled', 'disabled');
      });

      // Ir al principio
      $('#ir-principio').on('click', () => {
            $('html,body').animate({ scrollTop: 0 }, 1000);
      });

      // Enviar datos de formulario
      formulario.on('submit', function (e) {
            e.preventDefault();

            // Verificar que todos los campos estan completados
            let enviar = true;
            $(this).find('input[type=text]').each((index, element) => {
                  if (element.value === '') {
                        enviar = false;
                        return false;
                  }
            });

            // Generar curso
            if (enviar) {
                  const url = $(this).attr('action');
                  const method = $(this).attr('method');

                  $.ajax({
                        url: url,
                        method: method,
                        data: $(this).serialize(),
                        complete: function () {
                              console.log("Proceso de generar curso completado.");
                        },
                        success: function (respuesta) {
                              $('#modal-descargar-curso').modal('show');
                              $('#descargar-curso').attr('href', `/descargarCurso/${respuesta.titulo}`);
                              $('#generar-scorm').removeAttr('disabled');
                              console.log(`El curso "${respuesta.titulo}" ha sido generado con éxito.`);
                              config = respuesta.config;
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

                  // Título
                  $('#tituloCurso').val(config.tituloCurso);

                  // Número de ejercicios de evaluación finales
                  $('#numTest').val(config.numTest);

                  // Tema
                  const tema = $('#collapseTemas').find(`[data-value=${config.tema}]`).parents('.element').html();
                  $('.content-select[data-name=tema]').find('.btn-select').find('.element').html(tema);

                  // Unidades
                  const unidades = config.unidades;
                  for (const keyUnidad in unidades) {
                        // Título de la unidad - insertar el fragmento de la unidad
                        if (keyUnidad > 1)
                              $('#insertar-unidad').trigger('click', () => {
                                    $(`#unidad-${keyUnidad}`).val(unidades[keyUnidad].titulo);
                              });
                        else
                              $(`#unidad-${keyUnidad}`).val(unidades[keyUnidad].titulo);

                        // Ejercicios de autoevaluación
                        if (unidades[keyUnidad].ejercicios)
                              $(`#ejercicios-${keyUnidad}`).prop('checked', true);

                        // Apartados
                        const apartados = unidades[keyUnidad].apartados;
                        for (const keyApartado in apartados) {
                              // Obtener el orden del apartado
                              const index = parseInt(keyApartado.substring(6, 8));

                              if (index > 1) {
                                    $(`#ud-${keyUnidad}`).find('.insertar-apartado').trigger('click', () => {
                                          $(`#unidad-${keyUnidad}-apartado-${index}`).val(apartados[keyApartado]);
                                    });
                              } else
                                    $(`#unidad-${keyUnidad}-apartado-${index}`).val(apartados[keyApartado]);
                        }
                  }

                  // Bibliografía
                  (config.biblio) ? $('#check-biblio').prop('checked', true) : $('#check-biblio').prop('checked', false);

                  // Glosario
                  (config.glosario) ? $('#check-glosario').prop('checked', true) : $('#check-glosario').prop('checked', false);

                  // Habilitar el botón generar
                  $('#generar-scorm').removeAttr('disabled');
            };
      });
}
