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
  let posUnidades = $('#unidades').offset().top,
    scrollPos = $(window).scrollTop();

  configuracionCurso.find('.btn').removeClass('active');

  if (scrollPos >= posUnidades)
    configuracionCurso.find('.btn[href="#unidades"]').addClass('active');
  else
    configuracionCurso.find('.btn[href="#general"]').addClass('active');

});

// Validar formularios
window.addEventListener('load', function () {
  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.getElementsByClassName('needs-validation');
  // Loop over them and prevent submission
  var validation = Array.prototype.filter.call(forms, function (form) {
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
let actualizarNumUnidades = (num) => configuracionCurso.find('.menu').find('.btn[href="#unidades"]').find('.badge').text(parseInt(num));
let configuracionCurso = $('#configuracion-curso');

// Comportamiento del menu anclas
configuracionCurso.find('.menu').find('.btn').on('click', (e) => {

  let ancla = e.target.attributes.href.value;
  let pos = $(ancla).offset().top;
  $('html,body').animate({ scrollTop: pos - 60 }, 1000);

  configuracionCurso.find('.menu').find('.btn').removeClass('active');
  $(e.target).addClass('active');

});

// Insertar unidad
configuracionCurso.find('#insertar-unidad').on('click', (e, callback) => {

  let numUnidad = configuracionCurso.find('.unidad').length + 1;
  let urlUnidad = numUnidad < 10 ? `0${numUnidad}` : numUnidad;

  let nomAp = `ap01${urlUnidad}0101.html`;

  let fragmentoUnidad = `<div class="unidad" id="ud-${numUnidad}">
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
              <input type="text" class="form-control" name="unidad-${numUnidad}-apartado-1" id="unidad-${numUnidad}-apartado-1" placeholder="Nombre del apartado" required>
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
  let pos = configuracionCurso.find('.unidad').last().offset().top - 80;
  $('html,body').animate({ scrollTop: pos }, 1000);

  if (callback !== undefined) callback();

});

// Eliminar unidad
configuracionCurso.find('#unidades').on('click', '.eliminar-unidad', (e) => {
  $(e.target).parents('.unidad').remove();
  let num = configuracionCurso.find('.unidad').length;
  actualizarNumUnidades(num);
});

// Insertar apartado
configuracionCurso.find('#unidades').on('click', '.insertar-apartado', (e, callback) => {

  let numUnidad = $(e.target).parents('.unidad').index();
  let urlUnidad = numUnidad < 10 ? `0${numUnidad}` : numUnidad;

  let numAp = $(e.target).parents('.unidad').find('.apartados').find('.apartado').length + 1;
  let urlAp = numAp < 10 ? `0${numAp}` : numAp;

  let nomAp = `ap01${urlUnidad}${urlAp}01.html`;

  let fragmentoApartado = `<div class="form-group apartado">
    <label for="unidad-${numUnidad}-apartado-${numAp}">Nombre del apartado</label> <small class="text-muted ml-1 font-italic">${nomAp}</small>
    <input type="text" class="form-control" name="unidad-${numUnidad}-apartado-${numAp}" id="unidad-${numUnidad}-apartado-${numAp}" placeholder="Nombre del apartado" required>
    <button type="button" class="btn eliminar-apartado" data-toggle="tooltip" data-placement="top" title="Eliminar apartado"><i class="far fa-trash-alt"></i></button>
  </div>`;

  // Insertar fragmento
  $(e.target).parents('.unidad').find('.apartados').append(fragmentoApartado);
  $('[data-toggle="tooltip"]').tooltip();

  if (callback !== undefined) callback();

});

// Eliminar apartado
configuracionCurso.find('#unidades').on('click', '.eliminar-apartado', (e) => {
  $(e.target).parents('.apartado').remove();
});

// Ir a unidad 
$('#ir-a-unidad').on("keyup", function (e) {

  let unidad = $(this).val().trim();

  if (e.key === "Enter" && unidad !== "") {
    let pos = $(`#unidad-${unidad}`).offset().top;
    $('html,body').animate({ scrollTop: (pos - 200) }, 1000);
  }

});

// Menú lateral de opciones
menu(configuracionCurso);