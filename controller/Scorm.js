const fs = require('fs');
const fse = require('fs-extra');
const md5 = require('md5');
const variables = require('../config/variables')

function crearScorm(req, res) {
      
      try {
            var config = JSON.stringify(req.body);
            config = JSON.parse(config);
            
      } catch (error) {
            return res.status(404).send(error);
      }    

      // Limpiar la carpeta de los scorm
      fse.emptyDir(variables.dirScorm)
      .then(() => {
            
            let promesas = [];      
            let unidades = config.unidades;
            
            // Bibliografía
            unidades.bibliografia = {
                  titulo: "Bibliografía",
                  apartados: {
                        bibliografia: "Bibliografía"
                  }
            }

            // Glosario
            unidades.glosario = {
                  titulo: "Glosario",
                  apartados: {
                        glosario: "Glosario"
                  }
            }

            // Actividades de evaluación final
            console.log(config.numTest);
            console.log(Object.keys(unidades).length);

            for (let keyUnidad in unidades) {            

                  let items = "", resources = "";                  
                  let nomFile = (keyUnidad.toLowerCase().includes("biblio") || keyUnidad.toLowerCase().includes("glosario")) ? keyUnidad : `ud${keyUnidad}`
                  let destino = variables.destinoScorm + nomFile;                                               

                  // Crear carpeta por unidad 
                  fse.ensureDirSync(destino);

                  // Copiar los ficheros necesarios a la carpeta                  
                  fse.copySync(variables.originScorm, destino);
                  
                  let apartados = unidades[keyUnidad].apartados;
                  for (let keyApartado in apartados) {              
                  
                        // Crear el apartado en html
                        let fragmentoHtml = `<!DOCTYPE html>
                        <html style="height:100%;width:100%;">
                        <head>
                        <script type="text/javascript" src="scorm12.js"></script>
                        <script type="text/javascript">
                        codscorm="";
                        apartado=${keyApartado.replace('ap01','')};
                        var API;
                        var estadoscorm="not attempted";
                        var tiempo_sesion="";
                        var tiempo;
                        var terminado=false;
                        var segundos=0;
                        var minutos=0;
                        var horas=0;
                        var id_user="";
                        var porcentaje=0;
                        var codigocurso="";
                        window.onunload = function() {finalizarSCO();};
                        </script>
                        </head>
                        <BODY style="height: 97%;">
                        <script type="text/javascript">
                        inicializarSCO();
                        var un=API.LMSGetValue("cmi.core.student_id");
                        var nom=API.LMSGetValue("cmi.core.student_name");
                        document.write("<iframe name='marcocontenido' id='marcocontenido' width='100%' height='97%' src='${keyApartado}.html'></iframe>");
                        </script>
                        </BODY>
                        </html>`;
                        
                        promesas.push(fse.writeFile(`${destino}/${keyApartado}.html`, fragmentoHtml));
                        
                        
                        // Elementos para el IMSMANIFEST.XML
                        let codeItem = md5(new Date().getMilliseconds()),
                        codeRes = md5(new Date().getMilliseconds() + keyApartado);                  

                        items += `<item identifier="ITEM-${codeItem}" isvisible="true" identifierref="RES-${codeRes}">
                                    <title>${apartados[keyApartado]}</title>
                              </item>`;               
                        
                        resources += `<resource identifier="RES-${codeRes}" type="webcontent" href="${keyApartado}.html" adlcp:scormtype="sco">
                                          <file href="${keyApartado}.html" />
                                    </resource>`;

                  }    
                  
                  // Generar el IMSMANIFEST.XML
                  let fecha = new Date().getMilliseconds();
                  let codeOrg = md5(`plantilla-12-${fecha}`);
                  let fragmentoManifest = `<?xml version="1.0" encoding="UTF-8"?>
                  <manifest xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2" xmlns:imsmd="http://www.imsglobal.org/xsd/imsmd_rootv1p2p1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2" identifier="MANIFEST-4D1321494E892B9EA3DE0FCFC30C4088" xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
                  <metadata>
                        <schema>ADL SCORM</schema>
                        <schemaversion>1.2</schemaversion>
                  </metadata>
                        <organizations default="ORG-${codeOrg}">
                              <organization identifier="ORG-${codeOrg}" structure="hierarchical">
                                    <title>${unidades[keyUnidad].titulo}</title>
                                    ${items}
                              </organization>
                        </organizations>
                        <resources>
                              ${resources}                       
                        </resources>
                  </manifest>`;

                  promesas.push(fse.writeFile(`${destino}/imsmanifest.xml`, fragmentoManifest));

            }

            return Promise.all(promesas)
            .then(() => {            
                  
                  const Zipit = require('zipit'); 
                  let promesasZip = [];

                  // CREAR EL ZIP POR UNIDAD                  
                  for(let keyUnidad in unidades) {                        

                        let nomFile = (keyUnidad.toLowerCase().includes("biblio") || keyUnidad.toLowerCase().includes("glosario")) ? keyUnidad : `ud${keyUnidad}`
                        let origen = variables.dirScorm + nomFile;  
                        let files = [];

                        // Leer los ficheros de un directorio
                        fs.readdirSync(origen).forEach(file => files.push(`${origen}/${file}`));                                          
                                          
                        // Crear el zip utilizando el array de ficheros que debe contener el zip                        
                        Zipit({
                              input: files,
                              cwd: process.cwd()
                        }, (err, buffer) => {
                              if (!err) 
                                    promesasZip.push(fse.writeFile(`${variables.dirScorm}${nomFile}.zip`, buffer));
                        });
                  }

                  return Promise.all(promesasZip)
                  .then(() => {
                        res.status(200).send({titulo: config.tituloCurso})
                  })            
            })
      })   
      .catch((error) => res.status(404).send(error))

}

module.exports = { crearScorm };