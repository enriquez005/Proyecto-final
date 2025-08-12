const preview = document.getElementById("previewImagen");
const productos = document.querySelectorAll(".lista-productos li");

productos.forEach(producto => {
  producto.addEventListener("mouseenter", e => {
    const imgSrc = e.target.dataset.img;
    if (imgSrc) {
      preview.src = imgSrc;
      preview.style.display = "block";
      preview.style.opacity = "1";

      // Posicionamiento inteligente
      posicionarImagen(e.target);
    }
  });

  producto.addEventListener("mouseleave", () => {
    preview.style.opacity = "0";
    setTimeout(() => {
      if (preview.style.opacity === "0") {
        preview.style.display = "none";
      }
    }, 300);
  });

  // Seguimiento suave del mouse (opcional)
  producto.addEventListener("mousemove", e => {
    if (preview.style.display === "block") {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const previewWidth = 280;
      const previewHeight = 210;
      
      let leftPosition = mouseX + 15;
      let topPosition = mouseY - 10;
      
      // Evitar que se salga de la pantalla
      if (leftPosition + previewWidth > viewportWidth) {
        leftPosition = mouseX - previewWidth - 15;
      }
      
      if (topPosition + previewHeight > viewportHeight) {
        topPosition = mouseY - previewHeight + 10;
      }
      
      if (leftPosition < 10) leftPosition = 10;
      if (topPosition < 10) topPosition = 10;
      
      preview.style.left = `${leftPosition}px`;
      preview.style.top = `${topPosition}px`;
    }
  });
});

function posicionarImagen(elemento) {
  const rect = elemento.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const previewWidth = 280;
  const previewHeight = 210;
  
  let leftPosition = rect.right + 20;
  let topPosition = rect.top + window.scrollY;
  
  // Si no cabe a la derecha, mostrar a la izquierda
  if (leftPosition + previewWidth > viewportWidth) {
    leftPosition = rect.left - previewWidth - 20;
  }
  
  // Si no cabe arriba, ajustar hacia abajo
  if (topPosition + previewHeight > window.scrollY + viewportHeight) {
    topPosition = window.scrollY + viewportHeight - previewHeight - 20;
  }
  
  // Límites mínimos
  if (leftPosition < 10) leftPosition = 10;
  if (topPosition < window.scrollY + 10) topPosition = window.scrollY + 10;
  
  preview.style.left = `${leftPosition}px`;
  preview.style.top = `${topPosition}px`;
}

// Manejo de errores de carga de imágenes
preview.addEventListener("error", () => {
  console.warn("Error al cargar la imagen de preview");
  preview.style.display = "none";
});

// Precargar imágenes para mejor rendimiento
window.addEventListener("load", () => {
  productos.forEach(producto => {
    const imgSrc = producto.dataset.img;
    if (imgSrc && imgSrc.startsWith("data:image/svg+xml")) {
      const img = new Image();
      img.src = imgSrc;
    }
  });
});

console.log("🍰 Bendito Café - Sistema de preview de productos cargado correctamente");