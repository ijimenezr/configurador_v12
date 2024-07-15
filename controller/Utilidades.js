const setEjercicios = (tipo, orden, nombre) => {

    tipo = tipo != undefined ? tipo : "";
    orden = orden != undefined ? orden : "";

    return `<!DOCTYPE html>
      <html lang="es">

      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <title>${nombre}</title>
          <script src="js/loadCurso.js"></script>
      </head>

      <body style="overflow: hidden;">
          <div id="precarga"
              style=" position: fixed; top: 0; left: 0; background-color: #000000; width: 100%; height: 100%; z-index: 4; color: #ffffff; overflow: hidden;">
              <div class="content-precarga"
                  style=" position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
                  <div class="contador"></div>
                  <span class="barra-precarga"
                      style=" width: 100%; height: 2px; background-color: var(--color-basic-white); display: block; margin: 1rem 0;">
                      <span class="progreso"></span>
                  </span>
                  <div class="info-precarga"></div>
              </div>
          </div>

          <!-- data-tipo="global" => para los test de evaluación -->
          <!-- data-tipo=""       => para los ejercicios de autoevaluación -->
          <!-- data-orden="1"     => para los test de evaluación indicar el número del test -->
          <div id="wrapper" class="ejercicios-autoevaluacion" data-tipo="${tipo}" data-orden="${orden}">
              <div id="progreso"></div>
              <header>
                  <div class="fondo">
                      <img src="" alt="Evaluación" class="img-cover">
                      <div class="backdrop"></div>
                      <div class="info-header"></div>
                  </div>
              </header>
              <div class="pantalla ejercicios">
              
              </div>
          </div>
      </body>
      </html>`;
}

const generarContenidoEmpaquetadorHtml = (datos) => {

    let contenido_empaquetador, numeroHtml;

    contenido_empaquetador = '<!doctype html>\n<html>\n<head>\n<meta charset="utf-8">\n<title>Documentación para empaquetador</title>\n<style type="text/css" media="screen">html, body {font-size: 1em;font-family: monospace;line-height: 1.5em;}manual titulo, manual codigo {font-size: 1.1em; font-weight: bold;}capitulo {display: block;margin: 1em 0;padding: 1em;border-bottom: 1px dashed #999;}capitulo > titulo {font-size: 1.1em;font-weight: bold;margin-bottom: 1em;}capitulo > apartado {display: block;margin-left: 1em;padding:  0.2em 0;}</style>\n</head>\n<body>\n';

    // Código y título del manual
    contenido_empaquetador = contenido_empaquetador + '<manual>\n<codigo></codigo>\n'; // Código
    contenido_empaquetador = contenido_empaquetador + '<titulo>' + datos.tituloCurso + '</titulo>\n'; // Título
    contenido_empaquetador = contenido_empaquetador + '</manual>\n';

    // Apartados del manual
    for (const unidad in datos.unidades) {

        // UNIDAD
        contenido_empaquetador = contenido_empaquetador + '<capitulo numero="' + unidad + '">\n'; // Número orden de la unidad
        contenido_empaquetador = contenido_empaquetador + '<titulo>' + datos.unidades[unidad].titulo + '</titulo>\n'; // Título de la unidad

        let n_apartado = 0

        for (const apartado in datos.unidades[unidad].apartados) {
            // Número html
            numeroHtml = apartado + '.html';
            const tituloApartado = datos.unidades[unidad].apartados[apartado].apartado

            // APARTADOS
            n_apartado === 0 ?
                contenido_empaquetador = contenido_empaquetador + '<apartado numero="' + numeroHtml + '">' + tituloApartado + '</apartado>\n'
                :
                contenido_empaquetador = contenido_empaquetador + '<apartado numero="' + numeroHtml + '">' + n_apartado + '. ' + tituloApartado + '</apartado>\n'
            n_apartado++
        }

        numeroHtml = apartadoEjercicios(numeroHtml)
        contenido_empaquetador = contenido_empaquetador + '<apartado numero="' + numeroHtml + '">Ejercicios de autoaprendizaje</apartado>\n';
        contenido_empaquetador = contenido_empaquetador + '</capitulo>'
    }

    // Bibliografía
    if (datos.biblio) contenido_empaquetador = contenido_empaquetador + '<capitulo>\n<titulo>Bibliografía</titulo>\n<apartado numero="bibliografia.html">Bibliografía (vacio)</apartado>\n</capitulo>\n';

    // Glosario
    if (datos.glosario) contenido_empaquetador = contenido_empaquetador + '<capitulo>\n<titulo>Glosario</titulo>\n<apartado numero="glosario.html">Glosario (vacio)</apartado>\n</capitulo>\n';

    // Test de evaluación
    if (parseInt(datos.numTest) > 0) {
        contenido_empaquetador += '<capitulo><titulo>Tests de evaluación final</titulo>';
        for (let i = 1; i <= parseInt(datos.numTest); i++) contenido_empaquetador += '<apartado>Test de evaluación final ' + i + '</apartado>';
    }
    contenido_empaquetador += '</capitulo>';

    contenido_empaquetador = contenido_empaquetador + '</body>\n</html>';

    return contenido_empaquetador;
}

const apartadoEjercicios = (numero) => {
    const apartado = parseInt(numero.charAt(7)) + 1
    return numero.substring(0, 7) + apartado + numero.substring(8, 15)
}

module.exports = { setEjercicios, generarContenidoEmpaquetadorHtml };


