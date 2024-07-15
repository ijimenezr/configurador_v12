<?php
// Eliminar todos los ficheros del directrio temporal [tmp]
$dir = 'tmp';
deleteContentDir($dir);
if (isEmptyDir($dir)) // echo "El directorio [tmp] está vacío";


// Obtener fichero
$file = $_FILES['file'];

// Eliminar espacios en blanco en el nombre del fichero
$nameFile = limpiarCadena($file['name']);

// Cambiar extensión
$type = ['docx', 'doc'];
$nameFile = str_replace($type, '.zip', $nameFile);

// Actualizar el nombre del fichero
$file['name'] = $nameFile;

// Cargar el fichero en la carpeta temporal [tmp]
$dirZip = 'tmp/' . $file['name'];
$resultado = move_uploaded_file($file['tmp_name'], $dirZip);

if ($resultado) {
  // echo "Subido con éxito";

  // Descomprimir fichero
  $zip = new ZipArchive;
  if ($zip->open($dirZip) === TRUE) {

    // Crear directorio para descomprimir
    $nameFolderZip = str_replace('.zip', '', $nameFile);  // Nombre del directorio
    $dirDesZip = $dir . '/' . $nameFolderZip;             // Ruta para descomprimir
    mkdir($dirDesZip);                                    // Crear directorio

    // Descomprimir en el directorio indicado
    $zip->extractTo($dirDesZip);
    $zip->close();

    // echo 'El fichero ' . $nameFile . 'se ha descomprimido correctamente';

    // Leer el fichero [word/document.xml]
    $fileDocument = $dirDesZip . '/word/document.xml';
    $contentFile = file_get_contents($fileDocument);

    echo json_encode($contentFile);

  } else {
    // echo 'No se ha podidio descomprimir el fichero ' . $nameFile;
  }

} else {
  // echo "Error al subir archivo";
}

// Eliminar el contenido del directorio pasado por parámetro
function deleteContentDir($dir) {
  $files = array_diff(scandir($dir), array('.', '..'));
  foreach ($files as $file) {
    if (is_dir("$dir/$file")) {
      if (!isEmptyDir("$dir/$file")) deleteContentDir("$dir/$file");
      rmdir("$dir/$file");
    } else
      unlink("$dir/$file");
  }
}

// Detectar si el directorio pasado por parámetro está vacío
function isEmptyDir($dir){
  return (($files = @scandir($dir)) && count($files) <= 2);
}

function limpiarCadena($string) {

  $string = trim($string);

  $string = str_replace(' ', '_', $string); // Sustituir espaciones en blanco por guiones bajos (_)

  $string = str_replace(array('á', 'à', 'ä', 'â', 'ª', 'Á', 'À', 'Â', 'Ä'), array('a', 'a', 'a', 'a', 'a', 'A', 'A', 'A', 'A'), $string);

  $string = str_replace(array('é', 'è', 'ë', 'ê', 'É', 'È', 'Ê', 'Ë'), array('e', 'e', 'e', 'e', 'E', 'E', 'E', 'E'), $string);

  $string = str_replace(array('í', 'ì', 'ï', 'î', 'Í', 'Ì', 'Ï', 'Î'), array('i', 'i', 'i', 'i', 'I', 'I', 'I', 'I'), $string);

  $string = str_replace(array('ó', 'ò', 'ö', 'ô', 'Ó', 'Ò', 'Ö', 'Ô'), array('o', 'o', 'o', 'o', 'O', 'O', 'O', 'O'), $string);

  $string = str_replace(array('ú', 'ù', 'ü', 'û', 'Ú', 'Ù', 'Û', 'Ü'), array('u', 'u', 'u', 'u', 'U', 'U', 'U', 'U'), $string);

  $string = str_replace(array('ñ', 'Ñ', 'ç', 'Ç'), array('n', 'N', 'c', 'C'), $string);

  $string = strtolower($string); // Convertir el texto en minúscula

  // Esta parte se encarga de eliminar cualquier caracter extraño

  $string = str_replace(array("\\", "¨", "º", " - ", "-", "×", "~", '#', "@", "|", "!", '"', "·", "$", "%", "&", "/", "(", ")", "?", "'", "¡", "¿", "[", "^", "<code>", "]", "+", "}", "{", "¨", "´", ">", "< ", ";", ",", ":", "."), '', $string);

  // Se filtra para que no entren caracteres extraños, ya que se ha tenido problemas con algunos no contemplados.
  $string = preg_replace('([^A-Za-z0-9_])', '', $string);

  return $string;

}