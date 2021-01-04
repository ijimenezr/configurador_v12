import { isNavegador, isDispositivo } from "./detector.mjs";
import { select, selectReiniciar } from "./componentes.mjs";

var config = {}; 

// Tooltip
$('[data-toggle="tooltip"]').tooltip();

// Iniciar select
select();

// Validar formularios
window.addEventListener('load', function() {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
      form.addEventListener('submit', function(event) {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      }, false);
    });
}, false);


/* CONFIGURACIÓN CURSO */

let actualizarNumUnidades = (num) =>  configuracionCurso.find('.menu').find('.btn[href="#unidades"]').find('.badge').text(parseInt(num));
let configuracionCurso = $('#configuracion-curso');

// Comportamiento del menu anclas
configuracionCurso.find('.menu').find('.btn').on('click', (e) => {  
    
  let ancla = e.target.attributes.href.value;  
  let pos = $(ancla).offset().top;    
  $('html,body').animate({scrollTop: pos - 60}, 1000);

  configuracionCurso.find('.menu').find('.btn').removeClass('active');
  $(e.target).addClass('active');

});

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
  $('html,body').animate({scrollTop: pos}, 1000);  

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
$('#ir-a-unidad').on("keyup", function(e) {

  let unidad = $(this).val().trim();

  if(e.key === "Enter" && unidad !== "") {    
    let pos = $(`#unidad-${unidad}`).offset().top;        
    $('html,body').animate({scrollTop: (pos - 200)}, 1000);  
  }  

});

let formulario = $('#form-configuracion');

// Limpiar el formulario
$('#limpiar').on('click', () => {
  formulario.find('input[type=text], input[type=number]').val("");  
  // Eliminar todas las unidades con sus apartados correspondientes
  configuracionCurso.find('#unidades').find('.unidad:not(#ud-1)').remove();
  configuracionCurso.find('#ud-1').find('.apartados').find('.apartado:not(:first-child)').remove();  
  selectReiniciar();

  // Desactivar el botón genear scorm
  $('#generar-scorm').attr('disabled', 'disabled');
});

// Ir al principio
$('#ir-principio').on('click', () => {
  $('html,body').animate({scrollTop: 0}, 1000);
});

// Enviar datos de formulario
formulario.on('submit', function(e) {  
  e.preventDefault();  

  // Verificar que todos los campos estan completados
  let enviar = true;
  $(this).find('input[type=text]').each((index, element) => {
    
    if (element.value === "") {
      enviar = false;
      return false;
    }        
  });

  // Generar curso  
  if (enviar) {
    let url = $(this).attr('action'),
        method = $(this).attr('method');
    
    $.ajax({
      url: url,
      method: method,
      data: $(this).serialize(),
      complete: function() {
        console.log("Proceso de generar curso completado.");
      },
      success: function(respuesta) {      
        $('#modal-descargar-curso').modal('show');
        $('#descargar-curso').attr('href', `/descargarCurso/${respuesta.titulo}`);
        $('#generar-scorm').removeAttr('disabled');
        console.log(`El curso "${respuesta.titulo}" ha sido generado con éxito.`);
        config = respuesta.config;
      },
      error: function(jqXHR, textStatus, errorThrown) {                
          console.log("Error al generar el curso.");
      }
    });
  }
});

// Generar scorm
$('#generar-scorm').on('click', () => {

  let url = "/scorm",
      method = "POST";
      
    $.ajax({
      url: url,
      method: method,
      dataType:"json",
      contentType: "application/json",
      data: JSON.stringify(config),      
      complete: function() {
        console.log("Proceso de generar scorm completado.");        
      },  
      success: function(respuesta) {        
        let modal = $('#modal-descargar-scorm');        
        modal.find('.modal-content').find('.modal-body').find('ul').empty();
        for(let i = 1; i<= Object.keys(config.unidades).length; i++) 
          modal.find('.modal-content').find('.modal-body').find('ul').append(`<li><a href="/descargarScorm/${i}" class="btn btn-link"><i class="fas fa-file-archive"></i> Descargar paquete SCORM de la unidad ${i}</a></li>`);
        modal.modal('show');

        console.log(`El paquete scorm del curso "${respuesta.titulo}" ha sido generado con éxito.`);        
      },
      error: function(jqXHR, textStatus, errorThrown) {                          
          console.log("No se ha podido generar los paquetes scorm.");
      }
    });

});

// Cargar archivo de configuración
$('#cargar-config').on('click', function() {    
  $(this).next('input[type="file"]').trigger('click');    
});

// Leer el contenido del archivo
$('#input-file-config').on('change', function(e) {  

  // Eliminar todas las unidades con sus apartados correspondientes
  configuracionCurso.find('#unidades').find('.unidad:not(#ud-1)').remove();
  configuracionCurso.find('#ud-1').find('.apartados').find('.apartado:not(:first-child)').remove();  

  let file = e.target.files[0];
  if (!file) return;
  let reader = new FileReader();
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
    let tema = $('#collapseTemas').find(`[data-value=${config.tema}]`).parents('.element').html();
    $('.content-select[data-name=tema]').find('.btn-select').find('.element').html(tema);

    // Unidades
    let unidades = config.unidades;       
    for(let keyUnidad in unidades) {           

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
      let apartados = unidades[keyUnidad].apartados;      
      for (let keyApartado in apartados) {

        // Obtener el orden del apartado
        let index = parseInt(keyApartado.substring(6, 8));

        if (index > 1) {            
            $(`#ud-${keyUnidad}`).find('.insertar-apartado').trigger('click', () => {
              $(`#unidad-${keyUnidad}-apartado-${index}`).val(apartados[keyApartado]);             
            });
        } else 
        $(`#unidad-${keyUnidad}-apartado-${index}`).val(apartados[keyApartado]);               
      }      
    }

    // Habilitar el botón generar
    $('#generar-scorm').removeAttr('disabled');

  };
});