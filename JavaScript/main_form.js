// Referencia al formulario y al div para mostrar mensajes
const formulario = document.getElementById("encuesta");
const mensaje = document.getElementById("mensaje");

formulario.addEventListener("submit", (e) => {
    e.preventDefault(); // Evita que se recargue la página

    // Obtener los valores del formulario
    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Validación sencilla (opcional porque ya tienes "required" en HTML)
    if (nombre && email && password) {
        // Mostrar mensaje en pantalla
        mensaje.innerHTML = `
            <p style="color: black;"><strong>Gracias, ${nombre}.</strong> Hemos recibido tu mensaje.</p>
        `;
        // (Opcional) Limpiar campos
        formulario.reset();
    } else {
        mensaje.innerHTML = `
            <p style="color: red;">Por favor, completa todos los campos.</p>
        `;
    }
    setTimeout(() => {
        mensaje.innerHTML = "";
    }, 5000);
});