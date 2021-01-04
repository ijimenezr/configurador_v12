var isNavegador = {
    edge: () => {
        return navigator.userAgent.toLowerCase().search('edge') >= 0;
    },
    chorme: () => {
        return navigator.userAgent.toLowerCase().search('chrome') >= 0;
    },
    firefox: () => {
        return navigator.userAgent.toLowerCase().search('firefox') >= 0;
    },
    safari: () => {
        return navigator.userAgent.toLowerCase().search('safari') >= 0;
    }
};

var isDispositivo = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    }
}

export {isNavegador, isDispositivo}