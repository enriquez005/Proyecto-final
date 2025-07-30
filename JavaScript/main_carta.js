 const preview = document.getElementById("previewImagen");
  const productos = document.querySelectorAll(".lista-productos li");

  productos.forEach(producto => {
    producto.addEventListener("mouseenter", e => {
      const imgSrc = e.target.dataset.img;
      preview.src = imgSrc;
      preview.style.display = "block";

      // Coloca la imagen cerca del elemento
      const rect = e.target.getBoundingClientRect();
      preview.style.top = `${rect.top + window.scrollY}px`;
      preview.style.left = `${rect.right + 20}px`;
    });

    producto.addEventListener("mouseleave", () => {
      preview.style.display = "none";
    });
  });