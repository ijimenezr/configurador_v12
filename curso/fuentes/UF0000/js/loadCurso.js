let produccion = "../0000comunes/comunes_v12/",
	desarrollo = "https://recursosadicionales.com/desarrollo/0000comunes/comunes_v12/",
	url = produccion,
	urlLoadDinamic = url + 'js/loadDinamic.js';

const req = new XMLHttpRequest();
req.open('GET', urlLoadDinamic);
req.send();

// Comprobar que estamos en producción o trabajando en programación
req.onloadend = () => {

	// 	// Si no estamos en producción o programación cambiamos a desarrollo (maquetación)
	if (req.status == 404) {
		url = desarrollo;
		urlLoadDinamic = url + 'js/loadDinamic.js';
	}

	// 	// Insertar el script que nos enlaza con el motor de la plantilla
	// 	let head = document.getElementsByTagName('head')[0],
	//   element = document.createElement('script');
	// 	element.type = 'text/javascript';
	// 	element.src = url + 'js/loadDinamic.js';
	// 	element.defer = true;
	// 	head.appendChild(element);

	// Mensaje informativo
	if (urlLoadDinamic.search('recursosadicionales') >= 0) {
		console.log("MODO DESARROLLO");
		cargarLoad(url)
	} else if (window.location.host.search('.local') >= 0) {
		console.info("MODO PROGRAMACIÓN");
		cargarLoad(url)
	} else {
		console.info("MODO PRODUCCIÓN");
		cargarLoad(url)
	}
}

const cargarLoad = (url) => {
	let head = document.getElementsByTagName('head')[0],
		element = document.createElement('script');
	element.src = url + 'js/load.js';
	element.defer = true;
	head.appendChild(element);
	// element.src = url + 'js/loadDinamic.js';
	// head.appendChild(element);
}