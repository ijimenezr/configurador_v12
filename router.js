const express = require('express');
const configuracion = require('./controller/Configuracion');
const scorm = require('./controller/Scorm');
const router = express.Router();

// INICIO APP
router.get('/', (req, res) => {
      res.render('configuracion', { titulo: "Configurador Plantilla 12", tituloPantalla: "Configuración del curso" });
});

// CONFIGURACIÓN
router.post('/configuracion', configuracion.crearCurso);

// DESCARGAR ZIP DEL CURSO
router.get('/descargarCurso/:titulo', (req, res) => {      
      let url = `${__dirname}/curso/${req.params.titulo}.zip`;
      res.download(url);
})

// DESCARGAR FICHERO DE CONFIGURACIÓN DEL CURSO
router.get('/descargarConfig', (req, res) => {
      let url = `${__dirname}/curso/curso/config/config.json`;
      res.download(url);
})

// DESCARGAR LOS PAQUETES SCORMS
router.get('/descargarScorm/:ud', (req, res) => {
      let url = `${__dirname}/curso/scorm/${req.params.ud}.zip`;
      res.download(url);
});

// SCORM
router.post('/scorm', scorm.crearScorm);

module.exports = router;