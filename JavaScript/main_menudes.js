document.addEventListener("DOMContentLoaded", () => {
  const checkbox = document.getElementById("menu-hamb");
  const menu = document.getElementById("menu-slide");

  if (checkbox && menu) {
    menu.addEventListener("mouseleave", () => {
      checkbox.checked = false;
    });
  }
});

/*Reproduccion de audio*/
const audio = document.getElementById("miAudio");
const btn = document.getElementById("activarSonido");

audio.volume = 1.0;
audio.play().then(() => {
  console.log("Audio iniciado automáticamente");
  fadeToHalf(audio);
}).catch(() => {
  console.warn("El navegador bloqueó el audio. Mostrando botón...");
  btn.style.display = "inline-block";
});

btn.addEventListener("click", () => {
  audio.play().then(() => {
    fadeToHalf(audio);
    btn.style.display = "none";
  });
});

function fadeToHalf(audio) {
  const volumenFinal = 0.5;
  const pasos = 50;
  const duracion = 5000;
  const intervalo = duracion / pasos;
  let contador = 0;

  const fade = setInterval(() => {
    contador++;
    const nuevoVolumen = 1 - ((1 - volumenFinal) * contador / pasos);
    audio.volume = Math.max(volumenFinal, nuevoVolumen);
    if (contador >= pasos) {
      clearInterval(fade);
      audio.volume = volumenFinal;
    }
  }, intervalo);
}