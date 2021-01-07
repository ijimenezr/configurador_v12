var API, 
    datos = {},
    suspendData = {},
    tiempoInicial;

// Inicializar la comunicación con el LMS    
function inicializarSCO() {    

    // API para la comunicación con el LMS y los SCO
    API = window.parent.API;       

    // Inicializar la comunicación con el LMS
    API.LMSInitialize("");

    // Obtener los datos del scorm
    datos.estado = API.LMSGetValue("cmi.core.lesson_status");    
    datos.suspendData = API.LMSGetValue("cmi.suspend_data");

    // Casting para convertir string a objeto
    datos.suspendData = (datos.suspendData !== "") ? JSON.parse(datos.suspendData) : datos.suspendData;

    // Indicar que se ha inicializado pero todavía no ha sido completado
    if (datos.estado === "not attempted") {
        datos.estado = "incomplete";
        API.LMSSetValue("cmi.core.lesson_status", datos.estado);
        API.LMSCommit("");
    }

    tiempoInicial = new Date();
}

// Finalizar la cominicación con el LMS
function finalizarSCO() {

    // Calcular tiempo transcurrido
    let tiempoFinal = new Date();
    let tiempoTranscurrido = tiempoFinal - tiempoInicial;

    // Convertir tiempo en horas minutos y segundos
    let ms = tiempoTranscurrido % 1000;
    tiempoTranscurrido = (tiempoTranscurrido - ms) / 1000;
    let secs = tiempoTranscurrido % 60;
    tiempoTranscurrido = (tiempoTranscurrido - secs) / 60;
    let mins = tiempoTranscurrido % 60;
    let hrs = (tiempoTranscurrido - mins) / 60;

    // Guardar el tiempo de la sesión
    let tiempo = hrs + ":" + mins + ":" + secs;
    API.LMSSetValue("cmi.core.session_time", tiempo);
    API.LMSCommit("");

    // Finalizar la cominicación
    API.LMSFinish("");	
}

// Recibe los datos de la plantilla para enviarselos al LMS
function comunicacion(progreso) {

    let iframe = document.getElementById("marcocontenido").contentWindow;    

    // Si aún no se ha inicializado 
    if (!Object.keys(datos).length || undefined === datos || null === datos)
        inicializarSCO();

    switch (progreso.data) {

        // Devolver la información que se encuentra en el suspend_data
        case "inicializarprogreso":
            iframe.postMessage(datos.suspendData, "*");
            break;

        // Actualizar el estado a completado   
        case "completado":
            datos.estado = "completed";
            API.LMSSetValue("cmi.core.lesson_status", datos.estado);            
            API.LMSCommit("");
            break;

        // Guardar el suspend_data y la nota si son ejercicios de autoevaluación    
        default:
            datos.suspendData = progreso.data;
            API.LMSSetValue("cmi.suspend_data", JSON.stringify(datos.suspendData));                                 
            if (undefined !== progreso.data.nota && progreso.data.nota) {
                progreso.data.nota = (progreso.data.nota === 0) ? 1 : progreso.data.nota;
                let notaActual = API.LMSGetValue("cmi.core.score.raw");    
                if (notaActual < progreso.data.nota) {
                    API.LMSSetValue("cmi.core.score.raw", progreso.data.nota);    
                    API.LMSSetValue("cmi.core.score.max", "100");
                }
            }                
            API.LMSCommit("");
            break;
    }           
}


window.onunload = function() {    
    finalizarSCO();
};

window.addEventListener("message", comunicacion, false);