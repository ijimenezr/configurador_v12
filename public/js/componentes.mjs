const select = () => {
      const contentSelect = $('.content-select');

      // Iniciar desplegable - obtiene el foco
      selectReiniciar(contentSelect);

      // Click en desplegable
      $('.btn-select').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            contentSelect.find('.btn-select').find('.icon').addClass('fa-angle-down').removeClass('fa-angle-up');

            if (!contentSelect.find('.collapse').hasClass('show')) {
                  contentSelect.find('.collapse').addClass('show');
                  $(this).find('.icon').addClass('fa-angle-up').removeClass('fa-angle-down');
                  $(this).addClass('active');
            } else {
                  contentSelect.find('.collapse').removeClass('show');
                  $(this).find('.icon').removeClass('fa-angle-up').addClass('fa-angle-down');
                  $(this).removeClass('active');
            }
      });

      // Click en elementos del despegable
      contentSelect.find('.collapse').find('.element').on('click', function () {
            const contentHtml = $(this).html();
            const valor = $(this).find('.texto').attr('data-value');
            $(this).parents('.content-select').find('.btn-select').find('.element').html(contentHtml);
            $(this).parents('.content-select').find('input[type=hidden]').attr('value', valor);
      });

      // Perder el foco
      $('html').on('click', function () {
            contentSelect.find('.collapse').removeClass('show');
            contentSelect.find('.btn-select').find('.icon').addClass('fa-angle-down').removeClass('fa-angle-up');
            contentSelect.find('.btn-select').removeClass('active');
      });
}

const selectReiniciar = (contentSelect) => {
      const content = (contentSelect !== undefined) ? contentSelect : $('.content-select');

      // Iniciar desplegable - obtiene el foco
      content.each(function () {
            const elemento = $(this).find('.collapse').find('.card').find('.element')
            const primerContenido = elemento.first().html();
            const valor = elemento.find('.texto').attr('data-value');
            const name = $(this).attr('data-name');

            $(this).find('.btn-select').find('.element').html(primerContenido);
            if (!$(this).find('input[type="hidden"]').length)
                  $(this).prepend(`<input type="hidden" name="${name}" value="${valor}">`);
      });
}

const cargarDatos = (config) => {
      // Título
      $('#tituloCurso').val(config.tituloCurso);

      // Número de ejercicios de evaluación finales
      $('#numTest').val(config.numTest);

      // Tema
      const tema = $('#collapseTemas').find(`[data-value=${config.tema}]`).parents('.element').html();
      $('.content-select[data-name=tema]').find('.btn-select').find('.element').html(tema);
      $('.content-select[data-name=tema]').find('input[name="tema"]').val(config.tema)

      // Unidades
      const unidades = config.unidades;
      for (const keyUnidad in unidades) {
            // Título de la unidad - insertar el fragmento de la unidad
            if (keyUnidad > 1) $('#insertar-unidad').trigger('click', () => $(`#unidad-${keyUnidad}`).val(unidades[keyUnidad].titulo));
            else $(`#unidad-${keyUnidad}`).val(unidades[keyUnidad].titulo);

            // Ejercicios de autoevaluación
            unidades[keyUnidad].ejercicios ? $(`#ejercicios-${keyUnidad}`).prop('checked', true) : $(`#ejercicios-${keyUnidad}`).prop('checked', false);

            // Apartados
            const apartados = unidades[keyUnidad].apartados;
            for (const keyApartado in apartados) {
                  // Obtener el orden del apartado
                  const index = parseInt(keyApartado.substring(6, 8));

                  if (index > 1) {
                        if (apartados[keyApartado]['apartado'] === 'Resumen') $(`#ud-${keyUnidad}`).find('.resumen input[type="checkbox"]').prop('checked', true)
                        else $(`#ud-${keyUnidad}`).find('.insertar-apartado').trigger('click', () => {
                              $(`#unidad-${keyUnidad}-apartado-${index}`).val(apartados[keyApartado]['apartado']);
                              if (apartados[keyApartado]['subapartados'] !== undefined) {
                                    let contSub = 1
                                    for (const sub in apartados[keyApartado]['subapartados']) {
                                          const subapartado = apartados[keyApartado]['subapartados'][sub];
                                          $(`#ud-${keyUnidad}`).find(`#insertar-subapartado-${sub.split('-')[2]}`).trigger('click', () => {
                                                $(`#subapartado-${keyUnidad}-${sub.split('-')[2]}-${contSub}`).val(subapartado)
                                                contSub++
                                          })
                                    }
                              }
                        });
                  } else {
                        if (apartados[keyApartado]['apartado'] === 'Resumen') $(`#ud-${keyUnidad}`).find('.resumen input[type="checkbox"]').prop('checked', true)
                        else $(`#unidad-${keyUnidad}-apartado-${index}`).val(apartados[keyApartado]['apartado']);
                        if (apartados[keyApartado]['subapartados'] !== undefined) {
                              let contSub = 1
                              for (const sub in apartados[keyApartado]['subapartados']) {
                                    const subapartado = apartados[keyApartado]['subapartados'][sub];
                                    $(`#ud-${keyUnidad}`).find(`#insertar-subapartado-${sub.split('-')[2]}`).trigger('click', () => {
                                          $(`#subapartado-${keyUnidad}-${sub.split('-')[2]}-${contSub}`).val(subapartado)
                                          contSub++
                                    })
                              }
                        }
                  }
            }
      }

      // Bibliografía
      (config.biblio) ? $('#check-biblio').prop('checked', true) : $('#check-biblio').prop('checked', false);

      if (config.biblio && config.loadBiblio) {
            $('.biblio-glosa').find('#content_loadBiblio textarea[name="loadBiblio"]').remove()
            $('.biblio-glosa').find('.bibliografias').remove()
            let biblio = config.loadBiblio.split(':::')
            if (biblio.length <= 1) biblio = config.loadBiblio.split('\r\n')
            biblio.forEach((element, n) => {
                  if (element.split('::')[0] === 'monografia') $('#content_monografias').find('.anadir_biblio').before(`<div class="form-group bibliografias"><div class="summernote form-control" id="summernote-content_monografias_${n}">${element.split('::')[1]}</div><textarea style="display: none;" required data-editor="editor">${element.split('::')[1]}</textarea><button type="button" class="eliminar_biblio"><span class="fas fa-trash" aria-hidden="true"></span></button></div>`)
                  else if (element.split('::')[0] === 'textos') $('#content_textos').find('.anadir_biblio').before(`<div class="form-group bibliografias"><div class="summernote form-control" id="summernote-content_textos_${n}">${element.split('::')[1]}</div><textarea style="display: none;" required data-editor="editor">${element.split('::')[1]}</textarea><button type="button" class="eliminar_biblio"><span class="fas fa-trash" aria-hidden="true"></span></button></div>`)
                  else $('#content_legislacion').find('.anadir_biblio').before(`<div class="form-group bibliografias"><div class="summernote form-control" id="summernote-content_legislacion_${n}">${element.split('::')[1]}</div><textarea style="display: none;" required data-editor="editor">${element.split('::')[1]}</textarea><button type="button" class="eliminar_biblio"><span class="fas fa-trash" aria-hidden="true"></span></button></div>`)
            })
            loadWysiwyg()
            $('.biblio-glosa #content_loadBiblio .bibliografias .eliminar_biblio').on('click', (e) => $(e.currentTarget).parent().remove())
            $('.biblio-glosa').find('a[href="#collapseExample"]').trigger('click')
      }

      // Glosario
      (config.glosario) ? $('#check-glosario').prop('checked', true) : $('#check-glosario').prop('checked', false);

      if (config.biblio && config.loadGlosa) {
            $('.biblio-glosa').find('#content_loadGlosa #b_editGlosa').removeClass('ocultar')
            $('.biblio-glosa').find('#content_loadGlosa textarea').remove()
            $('.biblio-glosa').find('#content_loadGlosa #loadGlosa').after(`<textarea name="loadGlosa" style="visibility: hidden; position: absolute"/>`)
            $('.biblio-glosa').find('#content_loadGlosa textarea').val(config.loadGlosa)
      }

      // Habilitar el botón generar
      $('#generar-scorm').removeAttr('disabled');
}

const generarBiblioTextArea = () => {
      $('#content_loadBiblio').find('textarea[name="loadBiblio"]').remove()
      $('#content_loadBiblio').append('<textarea name="loadBiblio" style="visibility: hidden; position: absolute"/>')
      let biblio = ''
      $('#content_loadBiblio #collapseExample').find('.note-editable').each((index, element) => {
            if (element.innerHTML.search('Descripción') === -1) {
                  let tipo = ''
                  if ($(element).parents('.content_biblios').attr('id') === 'content_monografias') tipo = 'monografia::'
                  else if ($(element).parents('.content_biblios').attr('id') === 'content_textos') tipo = 'textos::'
                  else if ($(element).parents('.content_biblios').attr('id') === 'content_legislacion') tipo = 'legislacion::'
                  index >= ($('#content_loadBiblio #collapseExample').find('.note-editable').length - 1) ? biblio += (tipo + element.innerHTML) : biblio += (tipo + element.innerHTML + ':::')
            }
      })
      biblio.length < 1 ? $('#content_loadBiblio').find('textarea[name="loadBiblio"]').remove() : $('#content_loadBiblio').find('textarea[name="loadBiblio"]').val(biblio)
}

const cargarInformeCurso = (config) => {
      $('#modal-descargar-curso').find('#descargar_infoCurso').remove()
      $('#modal-descargar-curso').find('.modal-body').prepend(informeFinalCurso)
      if (config.numTest.length > 0) $('#modal-descargar-curso').find('.modal-body .numTest').prepend(`<p>Número de test de evaluación final: ${config.numTest}</p>`)
      else $('#modal-descargar-curso').find('.modal-body .numTest').prepend(`<p>Número de test de evaluación final: 0</p>`)
      if (config.biblio === true) $('#modal-descargar-curso').find('.modal-body .info_glosaBiblio').prepend(`<p style="margin: 0 0.5em; color: var(--success);"><i class="fa fa-check" aria-hidden="true"></i> Bibliografía</p>`)
      else $('#modal-descargar-curso').find('.modal-body .info_glosaBiblio').prepend(`<p style="margin: 0 0.5em; color: var(--danger);"><i class="fa fa-times" aria-hidden="true"></i> Bibliografía</p>`)
      if (config.glosario === true) $('#modal-descargar-curso').find('.modal-body .info_glosaBiblio').prepend(`<p style="margin: 0 0.5em; color: var(--success);"><i class="fa fa-check" aria-hidden="true"></i> Glosario</p>`)
      else $('#modal-descargar-curso').find('.modal-body .info_glosaBiblio').prepend(`<p style="margin: 0 0.5em; color: var(--danger);"><i class="fa fa-times" aria-hidden="true"></i> Glosario</p>`)
      $('#modal-descargar-curso').find('.modal-header .modal-title').text(`Descargar curso - ${config.tituloCurso}`)
      for (const key in config.unidades) {
            $('#modal-descargar-curso').find('.modal-body .unidades').append(`<div id="unidad_${key}"><div class="tit_unidad" style="display: flex;"><h5><b>${key}- ${config.unidades[key].titulo}</b></h5></div></div>`)
            if (config.unidades[key].ejercicios === true) $('#modal-descargar-curso').find(`.modal-body .unidades #unidad_${key} .tit_unidad`).append(`<p style="margin: 0 0.5em; color: var(--success);"><i class="fa fa-check" aria-hidden="true"></i> Ejercicios</p>`)
            else $('#modal-descargar-curso').find(`.modal-body .unidades #unidad_${key} .tit_unidad`).append(`<p style="margin: 0 0.5em; color: var(--danger);"><i class="fa fa-times" aria-hidden="true"></i> Ejercicios</p>`)
            for (const ap in config.unidades[key].apartados) {
                  $('#modal-descargar-curso').find(`.modal-body .unidades #unidad_${key}`).append(`<p>&nbsp&nbsp${ap} - ${config.unidades[key].apartados[ap].apartado}</p>`)
                  if (config.unidades[key].apartados[ap].subapartados) $('#modal-descargar-curso').find(`.modal-body .unidades #unidad_${key}`).append(`<p style="font-weight: bold; margin: 0;">&nbsp&nbspSubapartados:</p>`)
                  for (const sub in config.unidades[key].apartados[ap].subapartados)
                        $('#modal-descargar-curso').find(`.modal-body .unidades #unidad_${key}`).append(`<p>&nbsp&nbsp&nbsp&nbsp${config.unidades[key].apartados[ap].subapartados[sub]}</p>`)
            }
      }
      if (config.loadBiblio) $('#modal-descargar-curso').find('.modal-body .biblio').append('<h5><b>Bibliografías</b></h5>')
      else $('#modal-descargar-curso').find('.modal-body .biblio').remove()
      if (config.loadGlosa) $('#modal-descargar-curso').find('.modal-body .glosa').append('<h5><b>Glosario</b></h5>')
      else $('#modal-descargar-curso').find('.modal-body .glosa').remove()
      if (config.loadBiblio !== undefined)
            config.loadBiblio.split(':::').forEach(element => {
                  const tipo = element.split('::')[0] === 'monografia' ? 'Monografía' : element.split('::')[0] === 'textos' ? 'Textos electrónicos, bases de datos y programas informáticos' : 'Legislación y normativa'
                  $('#modal-descargar-curso').find('.modal-body .biblio').append(`<p><b>${tipo}</b>: ${element.split('::')[1]}</p>`)
            })
      if (config.loadGlosa !== undefined)
            config.loadGlosa.split('\r\n').forEach(element => $('#modal-descargar-curso').find('.modal-body .glosa').append(element))
}

export { select, selectReiniciar, cargarDatos, generarBiblioTextArea, cargarInformeCurso }