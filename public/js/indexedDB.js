var idIndexDb = new Date().getTime();
const openRequest = indexedDB.open('configuradorP12', 1);

openRequest.onupgradeneeded = event => {
      // Crear almacen de objetos sino existe
      let db = openRequest.result;
      if (!db.objectStoreNames.contains('ficheros')) db.createObjectStore('ficheros', { keyPath: 'id' });
}

openRequest.onerror = () => console.log("- ERROR en la actualicación del almacen de datos. -");
// openRequest.onsuccess = () => getIndexedDBAll();
//console.log("APERTURA DE LA BBDD LOCAL %cconfiguradorP10", 'background:#3498DB;color:#fff');

const setIndexedDB = contenido => {
      let db = openRequest.result;

      // Establece el modo de trabajo
      let transition = db.transaction(['ficheros'], 'readwrite');

      // Obtiene el alamcen de objetos
      let ficheros = transition.objectStore('ficheros');

      // Obtener el fichero deseado
      let fichero = ficheros.get(idIndexDb);

      // El valor existen en el almacen de objetos ACTUALIZAR
      fichero.onsuccess = event => fichero.result !== undefined ? actualizar(event, ficheros, contenido) : insertar(ficheros, contenido)
      fichero.onerror = error => console.log(error);

      // Insertar un objeto nuevo en el almacen de objetos
      let insertar = (ficheros, contenido) => {
            ficheros.getAll().onsuccess = event => {
                  const resultado = event.currentTarget.result;
                  resultado.length > 9 && eliminarIndexDB(resultado, ficheros);

                  let date = new Date();
                  const dia = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`
                  const mes = (date.getMonth() + 1) > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`
                  const hora = date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`
                  const min = date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`
                  const sec = date.getSeconds() > 9 ? date.getSeconds() : `0${date.getSeconds()}`

                  // Crear el objeto que se va a insertar en el almacen
                  let datos = {
                        id: idIndexDb,
                        titulo: contenido.tituloCurso,
                        datos: contenido,
                        fecha: `${dia}-${mes}-${date.getFullYear()} ${hora}:${min}:${sec}`
                  }

                  // Insertar el objeto en el almacen
                  let insert = ficheros.add(datos);
                  insert.onsuccess = () => console.log(`%cINSERTAR ID: ${insert.result} - TÍTULO: ${contenido[1]}`, 'background:#37B276;color:#fff');

                  // Error
                  insert.onerror = event => {
                        console.log(`Error ${insert.error}`);
                        // Ya existe un fichero con el mismo identificador
                        if (insert.error.name == 'ConstraintError') {
                              console.log("Ya existe un fichero con el mismo identificador.");
                              // event.preventDefault(); // No aborta la transición
                        }
                  }
            }
      }

      // Actualizar el valor del objeto en el almacen de objetos
      let actualizar = (event, ficheros, contenido) => {
            let date = new Date();

            // Obtener el contenido del objeto almacenado
            let data = event.currentTarget.result;

            // Cambiar el valor
            data.datos = contenido;    // Contenido del objeto de datos del curos
            data.titulo = contenido.tituloCurso;   // Nombre del curso
            data.fecha = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`

            // Actualizar el valor del objeto en el almacen
            let actualizarFichero = ficheros.put(data);

            // Error
            actualizarFichero.onerror = e => console.log("ERROR : " + e);

            // Resultado satisfactorio
            actualizarFichero.onsuccess = e => console.log(`%cACTUALIZAR ID: ${data.id} - TÍTULO: ${data.titulo}`, 'background:#F39C12;color:#fff');
      }
}

const getIndexedDBAll = () => {
      let db = openRequest.result;

      // Establece el modo de trabajo
      let transition = db.transaction(['ficheros'], 'readwrite');

      // Obtiene el alamcen de objetos
      let ficheros = transition.objectStore('ficheros');

      return ficheros
}

const eliminarIndexDB = (resultado, ficheros) => { for (let i = 0; i < resultado.length - 10; i++) ficheros.delete(resultado[i].id) }

const eliminarSelected = (id) => {
      let db = openRequest.result;

      // Establece el modo de trabajo
      let transition = db.transaction(['ficheros'], 'readwrite');

      // Obtiene el alamcen de objetos
      let ficheros = transition.objectStore('ficheros');

      ficheros.delete(id).onsuccess = () => $(`#${id}`).remove()
      ficheros.delete(id).onerror = e => console.log("ERROR : " + e);
}

const seleccionarIndexDB = identificador => {
      let db = openRequest.result;

      // Establece el modo de trabajo
      let transition = db.transaction(['ficheros'], 'readonly');

      // Obtiene el alamcen de objetos
      let ficheros = transition.objectStore('ficheros');

      // Obtener el fichero deseado
      let fichero = ficheros.get(parseInt(identificador));

      return fichero
}