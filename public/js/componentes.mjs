const select = () => {
      const contentSelect = $('.content-select');

      // Iniciar desplegable - obtiene el foco
      selectReiniciar(contentSelect);

      // Click en desplegable
      $('.btn-select').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            contentSelect.find('.btn-select').find('.icon').addClass('fa-angle-down').removeClass('fa-angle-up');

            if (!contentSelect.find('.collapse').hasClass('show')) {
                  contentSelect.find('.collapse').addClass('show');
                  $(this).find('.icon').addClass('fa-angle-up').removeClass('fa-angle-down');
                  $(this).addClass('active');
            } else {
                  contentSelect.find('.collapse').removeClass('show');
                  $(this).find('.icon').removeClass('fa-angle-up').addClass('fa-angle-down');
                  $(this).removeClass('active');
            }
      });

      // Click en elementos del despegable
      contentSelect.find('.collapse').find('.element').on('click', function () {
            const contentHtml = $(this).html();
            const valor = $(this).find('.texto').attr('data-value');
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

const selectReiniciar = (contentSelect) => {
      const content = (contentSelect !== undefined) ? contentSelect : $('.content-select');

      // Iniciar desplegable - obtiene el foco
      content.each(function () {
            const elemento = $(this).find('.collapse').find('.card').find('.element')
            const primerContenido = elemento.first().html();
            const valor = elemento.find('.texto').attr('data-value');
            const name = $(this).attr('data-name');

            $(this).find('.btn-select').find('.element').html(primerContenido);
            if (!$(this).find('input[type="hidden"]').length)
                  $(this).prepend(`<input type="hidden" name="${name}" value="${valor}">`);
      });
}

export { select, selectReiniciar }
