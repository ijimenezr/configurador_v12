import { select } from "./componentes.mjs";
import { setScheme } from "./colorScheme.mjs";
import menu from "./menu.mjs";

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

  if (scrollPos >= posUnidades)
    configuracionCurso.find('.btn[href="#unidades"]').addClass('active');
  else
    configuracionCurso.find('.btn[href="#general"]').addClass('active');
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

// CONFIGURACIÓN CURSO
const actualizarNumUnidades = (num) => configuracionCurso.find('.menu').find('.btn[href="#unidades"]').find('.badge').text(parseInt(num));
const configuracionCurso = $('#configuracion-curso');

// Comportamiento del menu anclas
configuracionCurso.find('.menu').find('.btn').on('click', (e) => {
  const ancla = e.target.attributes.href.value;
  const pos = $(ancla).offset().top;
  $('html,body').animate({ scrollTop: pos - 60 }, 1000);

  configuracionCurso.find('.menu').find('.btn').removeClass('active');
  $(e.target).addClass('active');
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
  const numAp = e.currentTarget.id.split('-')[2]
  const numSub = $(e.target).parents('.apartado').find('.subapartado').find('.subapartado').length + 1;

  const fragmentoSubapartado = `<div class="form-group subapartado">
    <label for="subapartado-${numAp}-${numSub}">Nombre del subapartado</label>
    <input type="text" class="form-control" name="subapartado-${numAp}-${numSub}" id="subapartado-${numAp}-${numSub}" placeholder="Nombre del subapartado" required>
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

// Menú lateral de opciones
menu(configuracionCurso);
