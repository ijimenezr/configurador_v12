let select = () => {

      let contentSelect = $('.content-select');

      // Iniciar desplegable - obtiene el foco
      selectReiniciar(contentSelect);

      // Click en desplegable
      $('.btn-select').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            $(this).addClass('active');
            let content = $(this).attr('href');            

            contentSelect.find('.collapse').removeClass('show');
            contentSelect.find('.btn-select').find('.icon').addClass('fa-angle-down').removeClass('fa-angle-up');

            if (!$(content).hasClass('show')) {
                  $(content).addClass('show');
                  $(this).find('.icon').addClass('fa-angle-up').removeClass('fa-angle-down');
            }
      });

      // Click en elementos del despegable
      contentSelect.find('.collapse').find('.element').on('click', function () {
            let contentHtml = $(this).html(),
                valor = $(this).find('.texto').attr('data-value');
            $(this).parents('.content-select').find('.btn-select').find('.element').html(contentHtml);
            $(this).parents('.content-select').find('input[type=hidden]').attr('value', valor);
      });

      // Perder el foco
      $('html').on('click', function () {
            contentSelect.find('.collapse').removeClass('show');
            contentSelect.find('.btn-select').find('.icon').addClass('fa-angle-down').removeClass('fa-angle-up');
            contentSelect.find('.btn-select').removeClass('active');
      });

}

let selectReiniciar = (contentSelect) => {      

      let content = (contentSelect !== undefined) ? contentSelect : $('.content-select');

      // Iniciar desplegable - obtiene el foco
      content.each(function () {            
            let elemento = $(this).find('.collapse').find('.card').find('.element'),
                primerContenido = elemento.first().html(),
                valor = elemento.find('.texto').attr('data-value'),
                name = $(this).attr('data-name');                

            $(this).find('.btn-select').find('.element').html(primerContenido);
            if (!$(this).find('input[type="hidden]').length)
                  $(this).prepend(`<input type="hidden" name="${name}" value="${valor}">`);
      });

}

export { select, selectReiniciar }