const botones = document.querySelectorAll(".Cartaprodu");

botones.forEach(boton => {
boton.addEventListener("click", () => {
    window.location.href = "index2.html";
    });
});
