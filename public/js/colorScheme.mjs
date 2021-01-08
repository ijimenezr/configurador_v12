let setScheme = () => {

      const preferenceQuery = window.matchMedia('(prefers-color-scheme: dark)'); // Preferencias de color
      const preferenceQueryColor = (window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light' ; // Color del SO (sistema operativo)
      const colorSchemeLocal = localStorage.getItem('colorScheme'); // Color almacenado en el localStorage (preferencia del usuario)
      const color = (colorSchemeLocal !== undefined) ? colorSchemeLocal : preferenceQueryColor; // Aplicar la preferencia de color del usario sino existe aplicar el color del SO

      const buttonSchema = document.querySelector('#color-scheme');      

      // Aplicar el  modo de color identificado
      let changeColorSheme = color => {

            if (color === "dark") {
                  document.querySelector('body').setAttribute('dark', true);
                  buttonSchema.setAttribute('data-color', 'light');
                  buttonSchema.setAttribute('data-original-title', 'Cambiar a modo claro');  
                  buttonSchema.innerHTML = '<i class="fas fa-sun"></i>';
                  localStorage.setItem('colorScheme', 'dark');  
            } else {
                  document.querySelector('body').setAttribute('dark', false);
                  buttonSchema.setAttribute('data-color', 'dark');
                  buttonSchema.setAttribute('data-original-title', 'Cambiar a modo oscuro');      
                  buttonSchema.innerHTML = '<i class="fas fa-moon"></i>';
                  localStorage.setItem('colorScheme', 'light');  
            }
      }
      changeColorSheme(color);

      // Eventos
      buttonSchema.addEventListener('click', (e) => changeColorSheme(e.currentTarget.getAttribute('data-color'))); 
      preferenceQuery.addEventListener("change", () => {
            let preferenceQueryColor = (window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light' ;
            changeColorSheme(preferenceQueryColor);
      });

}

export { setScheme }
  