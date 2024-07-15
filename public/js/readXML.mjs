const readXML = (xmlDoc) => {console.log(xmlDoc)
  // Leer el contenido de los ficheros document.xml y numbering.xml
  let xmlAll = JSON.parse(xmlDoc);

  // Leer el contenido del fichero document.xml y darle formato XML
  // let $xml = $(xmlAll[0]);
  let $xml = $(xmlAll);

  // Eliminar las divisiones de páginas
  $xml.find('w\\:p').each((index, element) => {
    if ($(element).find('w\\:br').attr('w:type') === "page") $(element).remove();
  });

  // Eliminar los textos en blanco
  $xml.find('w\\:p').each((index, element) => {
    if ($(element).text() === "") $(element).remove();
  });

  // Negrita
  /*
  $xml.find('w\\:b').each((index, element) => {
    let parent = $(element).parents('w\\:rPr');
    let tagText = $(parent).siblings('w\\:t');
    let text = `<strong>${tagText.text()}</strong>`;
    tagText.text(text);
  });
  */

  // Cursiva
  $xml.find('w\\:i').each((index, element) => {
    let parent = $(element).parents('w\\:rPr');
    let tagText = $(parent).siblings('w\\:t');
    let text = `<i>${tagText.text()}</i>`;
    tagText.text(text);
  });

  let tests = [], cont = -1;
  $xml.find('w\\:p').each((index, element) => {

    let texto = $(element).text();
    // Insertar las opciones
    tests.push(texto);


  });

  return tests;
}