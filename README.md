🧾 Documentación del Proyecto: Bendito Café
🧶 Descripción general del proyecto

Bendito Café es una aplicación web que tiene como objetivo presentar y promover productos ofrecidos en la cafetería a través de una interfaz amigable, moderna y responsiva. Permite a los usuarios conocer las especificaciones de los diferentes productos y realizar reservas a través de un formulario de reservas.

🧑‍🤝‍🧑 Integrantes del equipo
Enrique Zapata
Cristian Delgado
📌 Estructura del Proyecto
Proyecto-final/
├── index.html
├── index2.html
├── CSS/
│   └── style.css
    └── style2.css
├── JavaScript/
│   ├── main_form.js
│   └── main_img.js
    └── main_carta.js
    └── main_menudes.js
├── imagenes/
│   ├── Audio de inmerción.mp3
│   └── (otras imágenes de productos)
│   ├── 

 Tecnologías usadas
HTML5: Estructura semántica del sitio.

CSS3: Estilos personalizados, diseño responsivo con @media queries.

JavaScript (Vanilla): Interacciones dinámicas (formulario, especificaciones de productos).



🖼️ Descripción de funcionalidades
1. Galería de categorías de productos
Muestra una cuadrícula con las categorías de productos con imágenes.

Al hacer clic en el botón “nuestros productos”, redirige hacia otra página sección donde se muestra el menu por categorías, las calorías que cada producto tiene y una imagen del producto.

En la página de categorías de productos se despliega una imagen del producto con la información calórica al pasar por encima el cursor del mouse

2. Formulario de reservas
Contiene campos requeridos: nombre, correo electrónico y número de contacto.

Al enviar el formulario, se muestra un mensaje de confirmación y se limpia el formulario.

Validación integrada tanto en HTML como en JavaScript.

3. Navegación
Barra de navegación superior fija (sticky) con enlaces a secciones principales.

Logo ubicado al centro del HEAD  
menú de despliegue de navegación en un menu de hamburguesa a la izquierda del head.

4. Diseño responsivo
Adaptado para móviles y tabletas.

Uso de flexbox y grid para una estructura fluida.

Ajustes específicos con @media para pantallas menores a 768px y 600px.

5. Footer
Contiene los créditos del proyecto

🧩 Organización del código
main_form.js: Maneja la lógica de envío del formulario y muestra mensajes.

style.css: Agrupa estilos para el layout general, galería, formulario y efectos visuales como hover y blur.

💡 Mejores prácticas aplicadas
Separación de responsabilidades (HTML - estructura, CSS - diseño, JS - lógica).

Uso de flexbox y grid para distribución eficiente.

Accesibilidad: uso de etiquetas label, alt en imágenes y required en campos.

Código modular con archivos separados para estilos y scripts.