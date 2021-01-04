const express = require('express');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config()
const port = process.env.PORT;
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// Bootstrap - Jquery - Popper
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/popper.js/dist'));

// Ruta estática
app.use(express.static(__dirname + '/public'));

// Motor de plantillas
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Rutas
app.use('/', require('./router'));


// ERROR
app.use((req, res, next) => {
    res.status(404).render("404", {titulo: "Página 404"})
})

// Servidor
app.listen(port, () => {
    console.log(`ESCUCHANDO POR EL PUERTO: ${port}`);
}); 