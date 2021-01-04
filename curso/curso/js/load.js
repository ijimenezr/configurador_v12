var url             = '../0000comunes/comunes_v12/',
    urlLoadDinamic  = url + 'js/loadDinamic.js';

let head = document.getElementsByTagName('head')[0],
    element = document.createElement('script');
element.type = 'text/javascript';
element.src = urlLoadDinamic;
head.appendChild(element);