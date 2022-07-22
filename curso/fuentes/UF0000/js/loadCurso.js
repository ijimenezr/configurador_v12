let produccionCurso = "../0000comunes/comunes_v12/",
	desarrolloCurso = "https://recursosadicionales.com/desarrollo/0000comunes/comunes_v12/",
	urlCurso = produccionCurso,
	urlLoadDinamicCurso = urlCurso + 'js/loadDinamic.js';

const reqCurso = new XMLHttpRequest();
reqCurso.open('GET', urlLoadDinamicCurso);
reqCurso.send();

// Comprobar que estamos en producción o trabajando en programación
reqCurso.onloadend = () => {

	// 	// Si no estamos en producción o programación cambiamos a desarrollo (maquetación)
	if (reqCurso.status == 404) {
		urlCurso = desarrollo;
		urlLoadDinamicCurso = urlCurso + 'js/loadDinamic.js';
	}

	// 	// Insertar el script que nos enlaza con el motor de la plantilla
	// 	let head = document.getElementsByTagName('head')[0],
	//   element = document.createElement('script');
	// 	element.type = 'text/javascript';
	// 	element.src = url + 'js/loadDinamic.js';
	// 	element.defer = true;
	// 	head.appendChild(element);

	// Mensaje informativo
	if (urlLoadDinamicCurso.search('recursosadicionales') >= 0) {
		console.log("MODO DESARROLLO");
		cargarLoad(urlCurso)
	} else if (window.location.host.search('.local') >= 0) {
		console.info("MODO PROGRAMACIÓN");
		cargarLoad(urlCurso)
	} else {
		console.info("MODO PRODUCCIÓN");
		cargarLoad(urlCurso)
	}
}

const cargarLoad = (url) => {
	let head = document.getElementsByTagName('head')[0],
		element = document.createElement('script');
	element.type = 'text/javascript';
	element.src = url + 'js/load.js';
	element.defer = true;
	head.appendChild(element);
	element.src = url + 'js/loadDinamic.js';
	head.appendChild(element);
}