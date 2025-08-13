// ========== FORMULARIO DE RESERVAS CON WHATSAPP ==========

// Referencia al formulario y al div para mostrar mensajes
const formulario = document.getElementById("reservaForm");
const mensaje = document.getElementById("mensaje");

// Función para formatear la fecha
function formatearFecha(fecha) {
    const opciones = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
}

// Función para formatear la hora
function formatearHora(hora) {
    const [hours, minutes] = hora.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
}

// Función para validar que la fecha no sea en el pasado
function validarFecha(fecha) {
    const hoy = new Date();
    const fechaSeleccionada = new Date(fecha);
    
    // Resetear las horas para comparar solo fechas
    hoy.setHours(0, 0, 0, 0);
    fechaSeleccionada.setHours(0, 0, 0, 0);
    
    return fechaSeleccionada >= hoy;
}

formulario.addEventListener("submit", (e) => {
    e.preventDefault(); // Evita que se recargue la página

    // Obtener los valores del formulario
    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;
    const personas = document.getElementById("personas").value;
    const comentarios = document.getElementById("comentarios").value.trim();

    // Validación
    if (!nombre || !email || !telefono || !fecha || !hora || !personas) {
        mostrarMensaje("Por favor, completa todos los campos obligatorios.", "error");
        return;
    }

    // Validar fecha
    if (!validarFecha(fecha)) {
        mostrarMensaje("La fecha de reserva no puede ser en el pasado.", "error");
        return;
    }

    // Obtener número de WhatsApp del data attribute
    const numeroWhatsApp = formulario.dataset.whatsapp;
    
    if (!numeroWhatsApp) {
        mostrarMensaje("Error: Número de WhatsApp no configurado.", "error");
        return;
    }

    // Crear el mensaje para WhatsApp
    let mensajeWhatsApp = `🍽️ *NUEVA RESERVA - BENDITO CAFÉ*\n\n`;
    mensajeWhatsApp += `👤 *Cliente:* ${nombre}\n`;
    mensajeWhatsApp += `📧 *Email:* ${email}\n`;
    mensajeWhatsApp += `📱 *Teléfono:* ${telefono}\n\n`;
    mensajeWhatsApp += `📅 *Fecha:* ${formatearFecha(fecha)}\n`;
    mensajeWhatsApp += `🕒 *Hora:* ${formatearHora(hora)}\n`;
    mensajeWhatsApp += `👥 *Personas:* ${personas}\n\n`;
    
    if (comentarios) {
        mensajeWhatsApp += `💭 *Comentarios:*\n${comentarios}\n\n`;
    }
    
    mensajeWhatsApp += `_Reserva enviada desde la página web_`;

    // Crear URL de WhatsApp
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensajeWhatsApp)}`;

    // Mostrar mensaje de confirmación
    mostrarMensaje(`¡Perfecto, ${nombre}! Te estamos redirigiendo a WhatsApp para confirmar tu reserva.`, "exito");

    // Abrir WhatsApp después de un breve delay
    setTimeout(() => {
        window.open(urlWhatsApp, '_blank');
        
        // Limpiar formulario después de enviar
        formulario.reset();
        
        // Limpiar mensaje después de un tiempo
        setTimeout(() => {
            mensaje.innerHTML = "";
        }, 8000);
    }, 2000);
});

// Función para mostrar mensajes
function mostrarMensaje(texto, tipo) {
    const claseCSS = tipo === "error" ? "mensaje-error" : "mensaje-exito";
    mensaje.innerHTML = `<div class="${claseCSS}">${texto}</div>`;
    
    // Auto-limpiar mensaje de error después de 5 segundos
    if (tipo === "error") {
        setTimeout(() => {
            mensaje.innerHTML = "";
        }, 5000);
    }
}

// Establecer fecha mínima como hoy
document.addEventListener("DOMContentLoaded", () => {
    const inputFecha = document.getElementById("fecha");
    if (inputFecha) {
        const hoy = new Date().toISOString().split('T')[0];
        inputFecha.min = hoy;
    }
});

document.getElementById("reservaForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const reserva = {
        nombre: document.getElementById("nombre").value,
        email: document.getElementById("email").value,
        telefono: document.getElementById("telefono").value,
        fecha: document.getElementById("fecha").value,
        hora: document.getElementById("hora").value,
        personas: document.getElementById("personas").value,
        comentarios: document.getElementById("comentarios").value,
        estado: "pendiente"
    };

    let reservas = JSON.parse(localStorage.getItem("reservas")) || [];
    reservas.push(reserva);
    localStorage.setItem("reservas", JSON.stringify(reservas));

    alert("✅ Reserva registrada con éxito");
    document.getElementById("reservaForm").reset();
});
