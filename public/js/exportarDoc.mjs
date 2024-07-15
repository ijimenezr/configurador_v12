const exportarHtmlaDoc = (html, titulo) => {

  const filesEstilos = ['css/doc.css'];
  let promesas = [];
  let promesa;
  let estilos = "";

  Object.values(filesEstilos).find(file => {
    promesa = new Promise (resolve => {
      fetch(file)
      .then(response => response.text())
      .then(data => {
        estilos += '\n' + data;
        resolve(true)
      });
    });
  });
  promesas.push(promesa);

  Promise.all(promesas).finally(() => {
    // Construir el documento de descarga
    const contenidoDoc = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
                          <head>
                            <meta charset='utf-8'>
                            <title>${titulo}</title>
                            <style>${estilos}</style>
                          </head>
                          <body>
                            ${html}
                          </body>
                        </html>`;
    const blob = new Blob(['ufeff', contenidoDoc], {
      type: 'application/msword'
    });
    const url = `data:application/vnd.ms-word;charset=utf-8,${encodeURIComponent(contenidoDoc)}`;
    const fileName = titulo ? `${titulo}.doc` : "informe.doc";

    // Botón de descarga
    let link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.click();
  });
}
export {exportarHtmlaDoc}