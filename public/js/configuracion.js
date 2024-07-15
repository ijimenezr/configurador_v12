import { select } from "./componentes.mjs";
import { setScheme } from "./colorScheme.mjs";
import menu from "./menu.mjs";
import * as exportarDoc from './exportarDoc.mjs';
import { generarInformeACAP, generarInformeTE } from "./generarInformes.mjs";
// let { Document } = require('docxyz');

// Aplicar el esquema de color según el modo elegido o el modo del SO
setScheme();

// Tooltip
$('[data-toggle="tooltip"]').tooltip();

// Iniciar select
select();

// Activar los botones del menú dependiendo del scroll
$(window).scroll((e) => {
  const posUnidades = $('#unidades').offset().top;
  const scrollPos = $(window).scrollTop();

  configuracionCurso.find('.btn').removeClass('active');

  if (scrollPos >= posUnidades) configuracionCurso.find('.btn[href="#unidades"]').addClass('active');
  else configuracionCurso.find('.btn[href="#general"]').addClass('active');
});

// Validar formularios
window.addEventListener('load', function () {
  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.getElementsByClassName('needs-validation');
  // Loop over them and prevent submission
  Array.prototype.filter.call(forms, function (form) {
    form.addEventListener('submit', function (event) {
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });
}, false);

// GENERADOR DE INFORMES
$('#generadorInformes').on('click', () => {
  $('body').append(`<div id="pantallaInformes" class="pantallaEmergente">${pantalla_generadorInformes}</div>`)
  $('.pantallaEmergente').find('.close').on('click', () => {
    $('body').find('.pantallaEmergente').remove()
    $('body').removeClass('cargarCursosClick')
  })

  $('.pantallaEmergente').find('#buttonLoadCurso_informe').on('click', () => $('.pantallaEmergente').find('#inputLoadCurso_informe').trigger('click'))
  $('.pantallaEmergente').find('#inputLoadCurso_informe').on('change', (e) => {
    $('.pantallaEmergente').find('#menu_generador ul .active').attr('id') === 'apac' ? generarInformeACAP(e) : generarInformeTE(e)
  })

  $('.pantallaEmergente').find('#generarPDF').on('click', () => window.print())
  $('.pantallaEmergente').find('#generarDoc').on('click', () => {
    exportarDoc.exportarHtmlaDoc(document.querySelector('#informe').innerHTML, $('.pantallaEmergente .datos-curso').find('.titulo').val());
    return false;
  })
})

// CONFIGURACIÓN CURSO
const actualizarNumUnidades = (num) => configuracionCurso.find('.menu').find('.btn[href="#unidades"]').find('.badge').text(parseInt(num));
const configuracionCurso = $('#configuracion-curso');

// Comportamiento del menu anclas
configuracionCurso.find('.menu').find('a').on('click', (e) => {
  const ancla = e.currentTarget.attributes.href.value;
  const pos = $(ancla).offset().top;
  $('html,body').animate({ scrollTop: pos - 60 }, 1000);

  configuracionCurso.find('.menu').find('a').removeClass('active');
  $(e.currentTarget).addClass('active');
});

// Insertar unidad
configuracionCurso.find('#insertar-unidad').on('click', (e, callback) => {
  const numUnidad = configuracionCurso.find('.unidad').length + 1;
  const urlUnidad = numUnidad < 10 ? `0${numUnidad}` : numUnidad;

  const nomAp = `ap01${urlUnidad}0101.html`;

  const fragmentoUnidad = `<div class="unidad" id="ud-${numUnidad}">
  <span class="numUnidad">${urlUnidad}</span>
  <div class="content">
      <div class="form-group">
          <label for="unidad-${numUnidad}">Nombre de la unidad</label>
          <input type="text" class="form-control" name="unidad-${numUnidad}" id="unidad-${numUnidad}" placeholder="Nombre de la unidad" required>
          <button type="button" data-toggle="tooltip" data-placement="top" title="Eliminar unidad" class="btn eliminar-unidad"><i class="far fa-trash-alt"></i></button>
      </div>
      <div class="apartados">
          <div class="form-group apartado">
              <label for="unidad-${numUnidad}-apartado-1">Nombre del apartado</label> <small class="text-muted ml-1 font-italic">${nomAp}</small>
              <input type="text" class="form-control" value="Introducción" name="unidad-${numUnidad}-apartado-1" id="unidad-${numUnidad}-apartado-1" placeholder="Nombre del apartado" required>
          </div>          
      </div>
      <button type="button" class="btn btn-link insertar-apartado"><i class="fas fa-plus"></i> Insertar apartado</button>
      <div class="form-group ejercicios">
          <div class="custom-control custom-checkbox">
              <input type="checkbox" class="custom-control-input" name="ejercicios-${numUnidad}" id="ejercicios-${numUnidad}" checked="checked">
              <label class="custom-control-label" for="ejercicios-${numUnidad}">
                  Ejercicios de autoevaluación
              </label>
          </div>
      </div>
      <div class="form-group resumen">
          <div class="custom-control custom-checkbox">
              <input type="checkbox" class="custom-control-input" name="resumen-${numUnidad}" id="resumen-${numUnidad}">
              <label class="custom-control-label" for="resumen-${numUnidad}">
                  Resumen de la unidad ${numUnidad}
              </label>
          </div>
      </div>
    </div>
  </div>`;

  configuracionCurso.find('.unidad').last().after(fragmentoUnidad);
  $('[data-toggle="tooltip"]').tooltip();

  // Actualizar numero total de unidades
  actualizarNumUnidades(numUnidad);

  // Posicionar scroll al final
  const pos = configuracionCurso.find('.unidad').last().offset().top - 80;
  $('html,body').animate({ scrollTop: pos }, 1000);

  if (callback !== undefined) callback();
});

// Eliminar unidad
configuracionCurso.find('#unidades').on('click', '.eliminar-unidad', (e) => {
  $(e.target).parents('.unidad').remove();
  const num = configuracionCurso.find('.unidad').length;
  actualizarNumUnidades(num);
});

// Insertar apartado
configuracionCurso.find('#unidades').on('click', '.insertar-apartado', (e, callback) => {
  const numUnidad = $(e.target).parents('.unidad').index();
  const urlUnidad = numUnidad < 10 ? `0${numUnidad}` : numUnidad;

  const numAp = $(e.target).parents('.unidad').find('.apartados').find('.apartado').length + 1;
  const urlAp = numAp < 10 ? `0${numAp}` : numAp;

  const nomAp = `ap01${urlUnidad}${urlAp}01.html`;

  const fragmentoApartado = `<div class="form-group apartado">
    <label for="unidad-${numUnidad}-apartado-${numAp}">Nombre del apartado</label> <small class="text-muted ml-1 font-italic">${nomAp}</small><button type="button" id="insertar-subapartado-${numAp}" class="btn btn-link insertar-subapartado"><i class="fas fa-plus"></i> Insertar subapartado</button>
    <input type="text" class="form-control" name="unidad-${numUnidad}-apartado-${numAp}" id="unidad-${numUnidad}-apartado-${numAp}" placeholder="Nombre del apartado" required>
    <button type="button" class="btn eliminar-apartado" data-toggle="tooltip" data-placement="top" title="Eliminar apartado"><i class="far fa-trash-alt"></i></button>
    <div class="subapartados-${numAp}"></div>
  </div>`;

  // Insertar fragmento
  $(e.target).parents('.unidad').find('.apartados').append(fragmentoApartado);
  $('[data-toggle="tooltip"]').tooltip();

  if (callback !== undefined) callback();
});

// Eliminar apartado
configuracionCurso.find('#unidades').on('click', '.eliminar-apartado', (e) => {
  $('.tooltip-inner').remove()
  $(e.target).parents('.apartado').remove();
});

//Insertar subapartado
configuracionCurso.find('#unidades').on('click', '.insertar-subapartado', (e, callback) => {
  const numUni = $(e.target).parents('.unidad').index();
  const numAp = e.currentTarget.id.split('-')[2]
  const numSub = $(e.target).parent().find(`.subapartados-${numAp}`).find('.subapartado').length + 1;

  const fragmentoSubapartado = `<div class="form-group subapartado">
    <label for="subapartado-${numUni}-${numAp}-${numSub}">Nombre del subapartado</label>
    <input type="text" class="form-control" name="subapartado-${numUni}-${numAp}-${numSub}" id="subapartado-${numUni}-${numAp}-${numSub}" placeholder="Nombre del subapartado" required>
    <button type="button" class="btn eliminar-subapartado" data-toggle="tooltip" data-placement="top" title="Eliminar subapartado"><i class="far fa-trash-alt"></i></button>
  </div>`;

  // Insertar fragmento
  $(e.target).parents('.unidad').find(`.subapartados-${numAp}`).append(fragmentoSubapartado);
  $('[data-toggle="tooltip"]').tooltip();

  if (callback !== undefined) callback();
})

// Eliminar subapartado
configuracionCurso.find('#unidades').on('click', '.eliminar-subapartado', (e) => {
  $('.tooltip-inner').remove()
  $(e.target).parents('.subapartado').remove();
});

// Ir a unidad
$('#ir-a-unidad').on("keyup", function (e) {
  const unidad = $(this).val().trim();

  if (e.key === "Enter" && unidad !== "") {
    const pos = $(`#unidad-${unidad}`).offset().top;
    $('html,body').animate({ scrollTop: (pos - 200) }, 1000);
  }
});

configuracionCurso.find('.biblio-glosa').find('a[href="#collapseExample"]').on('click', function (e) {
  $(e.currentTarget).toggleClass('click')
})

configuracionCurso.find('.biblio-glosa #b_loadGlosa').on('click', function (e) {
  e.preventDefault();
  $(this).next('input[type="file"]').val('')
  $(this).next('input[type="file"]').trigger('click');
});

configuracionCurso.find('.biblio-glosa input[type="file"]').on('change', function (e) {
  let file = (e.target.files !== undefined) ? e.target.files[0] : e.dataTransfer.files[0];
  const input = this
  const fileTypeText = "txt";
  const fileTypeWord = ["docx", "doc"];
  // Detectar exetensión del fichero
  let extension = file.name.split('.').pop().toLowerCase(),
    isSuccessText = fileTypeText.indexOf(extension) > -1,
    isSuccessWord = fileTypeWord.indexOf(extension) > -1;

  const fileReader = new FileReader();
  $(input).next('button').removeClass('ocultar')
  $(input).parent().find('textarea').remove()
  $(input).after(`<textarea name="${$(input).attr('id')}" style="visibility: hidden; position: absolute"/>`)

  if (isSuccessText) { // El fichero es texto plano
    fileReader.onload = async () => {
      let text = ''
      fileReader.result.split('\r\n').forEach((p) => text = text + `<p>${p}</p>`)
      $(input).next('textarea').val(text)
    }
    fileReader.readAsText(file, 'UTF-8');
  } else if (isSuccessWord) { // Fichero word
    fileReader.onloadend = function () {
      mammoth.convertToHtml({ arrayBuffer: fileReader.result }).then(function (resultObject) { $(input).next('textarea').val(resultObject.value) })
    };
    fileReader.readAsArrayBuffer(file);
  }
});

configuracionCurso.find('.biblio-glosa #b_editGlosa').on('click', function (e) {
  e.preventDefault();
  $('body').addClass('cargarCursosClick')
  $('body').append(pantallaEditarGlosario)
  $('#editar_glosario').find('#summernote-content_editar_glosario').append($(this).parent().find('textarea').val())
  $('#editar_glosario').find('textarea').val($(this).parent().find('textarea').val())
  loadWysiwyg()
  $('.pantallaEmergente').find('.close').on('click', () => {
    $('body').find('.pantallaEmergente').remove()
    $('body').removeClass('cargarCursosClick')
  })
  $('.pantallaEmergente').find('#b_editarTextarea').on('click', () => {
    $('.biblio-glosa').find('textarea[name="loadGlosa"]').val($('.pantallaEmergente').find('.note-editable')[0].innerHTML)
    $('body').find('.pantallaEmergente').remove()
    $('body').removeClass('cargarCursosClick')
  })
});

configuracionCurso.find('.biblio-glosa input[type="checkbox"]').on('change', function () {
  if (!$(this).prop('checked')) {
    $(this).siblings('button').attr('disabled', 'disabled')
    $(this).parent().find('textarea').remove()
    $(this).parent().find('button').last().addClass('ocultar')
    $(this).parent().find('input[type="file"]').val('')
  } else $(this).siblings('button').removeAttr('disabled')
});

/*SUMMERNOTE*/
loadWysiwyg()

configuracionCurso.find('.biblio-glosa #content_loadBiblio .anadir_biblio').on('click', function (e) {
  let insert = ''
  const n = $(e.currentTarget).parent().find('.bibliografias').length + 1
  if (e.currentTarget.id === 'insertar-monografia') insert = `<div class="form-group bibliografias"><div class="summernote form-control" id="summernote-content_monografias_${n}"><p class="info"><span class="autor">Autor </span><span class="titulo">Título </span><span class="origen">Origen</span></p><p class="descripcion">Descripción</p></div><textarea style="display: none;" required data-editor="editor"><p class="info"><span class="autor">Autor </span><span class="titulo">Título </span><span class="origen">Origen</span></p><p class="descripcion">Descripción</p></textarea><button type="button" class="eliminar_biblio"><span class="fas fa-trash" aria-hidden="true"></span></button></div>`
  else if (e.currentTarget.id === 'insertar-textos') insert = `<div class="form-group bibliografias"><div class="summernote form-control" id="summernote-content_textos_${n}"><p class="titulo">Título. <a href="" class="enlace" target="_blank" title="Pulsa para ver el contenido">Enlace</a></p><p class="descripcion">Descripción</p></div><textarea style="display: none;" required data-editor="editor"><p class="titulo">Título. <a href="" class="enlace" target="_blank" title="Pulsa para ver el contenido"><span class="fas fa-link"></span></a></p><p class="descripcion">Descripción</p></textarea><button type="button" class="eliminar_biblio"><span class="fas fa-trash" aria-hidden="true"></span></button></div>`
  else insert = `<div class="form-group bibliografias"><div class="summernote form-control" id="summernote-content_legislacion_${n}"><p class="titulo">Título. <a href="" class="enlace" target="_blank">Enlace</a></p><p class="disponible">Descripción</p></div><textarea style="display: none;" required data-editor="editor"><p class="titulo">Título. </p><p class="disponible">Disponible en: <a href="" class="enlace" target="_blank"><span class="fas fa-balance-scale-left"></span></a></p></textarea><button type="button" class="eliminar_biblio"><span class="fas fa-trash" aria-hidden="true"></span></button></div>`
  $(e.currentTarget).before(insert)
  loadWysiwyg()
  configuracionCurso.find('.biblio-glosa #content_loadBiblio .bibliografias .eliminar_biblio').on('click', (e) => $(e.currentTarget).parent().remove())
})

configuracionCurso.find('.biblio-glosa #content_loadBiblio .bibliografias .eliminar_biblio').on('click', (e) => $(e.currentTarget).parent().remove())

configuracionCurso.find('.b_info').on('click', (e) => {
  let contenido = ''
  if ($(e.currentTarget).attr('id') === 'b_infoGlosa') contenido = '<div><p><strong>Palabra</strong>: Frase de definición.</p><p><b>Ejemplo -> </b><strong>Modalidad contributiva</strong>: hace referencia a aquellas prestaciones que los perceptores reciben por haber cotizado durante su vida laboral.</p></div>'
  else if ($(e.currentTarget).attr('id') === 'b_infoMono') contenido = '&lt;p class="info"&gt;&lt;span class="autor"&gt;Autor &lt;/span&gt;&lt;span class="titulo"&gt;Título &lt;/span&gt;&lt;span class="origen"&gt;Origen&lt;/span&gt;&lt;/p&gt;&lt;p class="descripcion"&gt;Descripción&lt;/p&gt;'
  else if ($(e.currentTarget).attr('id') === 'b_infoTextos') contenido = '&lt;p class="titulo"&gt;Título. &lt;a href="" class="enlace" target="_blank" title="Pulsa para ver el contenido"&gt;&lt;span class="fas fa-link"&gt;&lt;/span&gt;&lt;/a&gt;&lt;/p&gt;&lt;p class="descripcion"&gt;Descripción&lt;/p&gt;'
  else if ($(e.currentTarget).attr('id') === 'b_infoLegis') contenido = '&lt;p class="titulo"&gt;Título. &lt;a href="" class="enlace" target="_blank"&gt;Enlace&lt;/a&gt;&lt;/p&gt;&lt;p class="disponible"&gt;Descripción&lt;/p&gt;'
  $('body').append(`<div class="pantallaEmergente"><div class="ayudaFormato"><div class="titulo"><h2>Ayuda</h2><button type="button" class="close" data-dismiss="modal" aria-label="Cerrar ventana"><span aria-hidden="true">×</span></button></div>${contenido}</div></div>`)
  $('.pantallaEmergente').find('.close').on('click', () => $('body').find('.pantallaEmergente').remove())
})

// Menú lateral de opciones
menu(configuracionCurso);
