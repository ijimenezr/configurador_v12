const fs = require('fs');
const fse = require('fs-extra');
const util = require('util') ;
const { setEjercicios } = require("./Utilidades");
let titulo;

function crearCurso(req, res) {

      // Eliminar todos los zip existentes en el directorio de cursos
      const testFolder = 'curso/';

      fs.readdirSync(testFolder).forEach(file => {
            if (file.includes('zip'))
                  fs.unlinkSync(`curso/${file}`);
      });

      let datos = req.body;
          config = {}, 
          unidad = 0;

      for(let key in datos) {           

            if (key.toLocaleLowerCase().includes("apartado")) {
                  
                  let apartado = key.replace(`unidad-${unidad}-apartado-`,"");                                    
                  
                  // Nombre del fichero del apartado                  
                  let nomApartado = nombreApartado(unidad, apartado);

                  if (config.unidades[unidad].apartados === undefined) config.unidades[unidad].apartados = {};
                        config.unidades[unidad].apartados[nomApartado] = datos[key];                 
                  

            } else if (key.toLocaleLowerCase().includes("unidad")) {

                  unidad = key.replace("unidad-","");                  

                  // Unidad
                  if (config.unidades === undefined) config.unidades = {};
                        config.unidades[unidad] = {"titulo": datos[key]};
                  
                  // Ejercicios de autevaluación      
                  if (datos[`ejercicios-${unidad}`])
                        config.unidades[unidad]["ejercicios"] = true;
                  else      
                        config.unidades[unidad]["ejercicios"] = false;
                        
                  delete datos[`ejercicios-${unidad}`];      

            } else 
                  config[key] = datos[key];


            // Título - Se reemplaza los espacios por guines bajos, se eliminan las tildes y se convierte todo a minúscula
            titulo = config.tituloCurso.replace(/\s/g, "_").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();      
                               
      }

      // Eliminar la carpeta para volver a crear un curso
      fse.emptyDir('curso/curso')
      .then(() => {           

            // Crear los ficheros necesarios del curso
            let source = "curso/fuentes/UF0000/";
            let destination = "curso/curso/";            

            let folder = ['animaciones', 'audios', 'css', 'descargas','documentos', 'imagenes/contenids', 'imagenes/portadas','videos']            
            folder.forEach(element => fse.ensureDirSync(`${source}/${element}`));
            
            return fse.copy(source, destination);                             

      })      
      .then(() => {                                                   

            // Eliminar ficheros no necesarios
            fse.removeSync('curso/curso/apartado.html');
            fse.removeSync('curso/curso/evaluacion.html');

            // Crear el fichero de configuración
            return fse.writeJson('curso/curso/config/config.json', config)
      })
      .then(result => {           

           // Crear los apartados, ejercicios de autoevaluación y las evaluaciones finales
           let source = "curso/fuentes/UF0000/apartado.html";
           let unidades = config.unidades;
           let promesas = [];
           const writeFile = util.promisify(fs.writeFile);

           // Apartados           
            for(let keyUnidad in unidades) {           
                  let apartados = unidades[keyUnidad].apartados;                  
                  for(let keyApartado in apartados) {
                        let destination = `curso/curso/${keyApartado}.html`;                   
                        promesas.push(fse.copy(source, destination));

                  }
                  // Ejercicios de autoevaluación                        
                  if (unidades[keyUnidad].ejercicios) {                              
                        let num = Object.keys(apartados).length + 1;
                        let nomApartado = nombreApartado(keyUnidad, num);
                        // let source = "curso/fuentes/UF0000/evaluacion.html";
                        let destination = `curso/curso/${nomApartado}.html`;                   
                        let ejercicios = setEjercicios(); 
                        promesas.push(writeFile(destination, ejercicios));    
                        // promesas.push(fse.copy(source, destination));                       
                  }
            }
            
            // Ejercicios de evaluación final                        
            let num = config.numTest;            
            // let source = "curso/fuentes/UF0000/test.html";
            for(let i = 1; i<=num; i++) {                  
                  let totalUnidades = Object.keys(unidades).length + i;
                  let numEv = (totalUnidades < 9) ? '0' + totalUnidades : numEv;                  
                  let nomEvaluacion = `ap01${numEv}0101`;
                  let destination = `curso/curso/${nomEvaluacion}.html`;
                  let ejercicios = setEjercicios("global", i);
                  promesas.push(writeFile(destination, ejercicios));    
                  // promesas.push(fse.copy(source, destination));
            }

                  
            return Promise.all(promesas)

      })      
      .then(() => {
            
           // Crear el zip 
           const Zipit = require('zipit'); 
            Zipit({
                  input: ['curso/curso'],
                  cwd: process.cwd()
            }, (err, buffer) => {
                  if (!err) 
                        return new Promise((resolve, rejects) => {
                              fs.writeFile(`curso/${titulo}.zip`, buffer, (err, data) => {
                                    if (err) rejects(err);
                                    resolve();
                              })
                        })                  
            });
            
      })
      .then(result => res.send({titulo, config}))
      .catch((error) => {console.log(error); res.status(404).send(error)})
} 

function nombreApartado(unidad, apartado) {
      let numUnidad = (unidad > 9) ? unidad : "0" + unidad;
      let numApartado = (apartado > 9) ? apartado : "0" + apartado;
      return "ap01" + numUnidad + numApartado + "01";                  
}

module.exports = {crearCurso};