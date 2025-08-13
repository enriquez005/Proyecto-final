// ==== Datos de ejemplo de reservas ====
// ==== Cargar reservas guardadas en localStorage ====
let reservas = JSON.parse(localStorage.getItem("reservas")) || [];

// Si las reservas no tienen ID, les asignamos uno único
reservas = reservas.map((r, i) => ({
    id: r.id || i + 1,
    cliente: r.nombre, // tu formulario guarda como "nombre", no "cliente"
    fecha: r.fecha,
    hora: r.hora,
    personas: parseInt(r.personas),
    estado: r.estado || "pendiente"
}));


// ==== Referencias a elementos ====
const listaReservas = document.getElementById("listaReservas");
const filtroEstado = document.getElementById("filtroEstado");
const filtroFecha = document.getElementById("filtroFecha");
const buscarCliente = document.getElementById("buscarCliente");

const totalReservas = document.getElementById("totalReservas");
const reservasPendientes = document.getElementById("reservasPendientes");
const reservasConfirmadas = document.getElementById("reservasConfirmadas");
const personasHoy = document.getElementById("personasHoy");

const modalEstado = document.getElementById("modalEstado");
const cerrarModalEstado = document.getElementById("cerrarModalEstado");
const confirmarEstado = document.getElementById("confirmarEstado");
let reservaSeleccionada = null;

// ==== Función para renderizar reservas ====
function mostrarReservas() {
    let filtradas = reservas.filter(r => {
        let coincideEstado = filtroEstado.value === "todas" || r.estado === filtroEstado.value;
        let coincideFecha = !filtroFecha.value || r.fecha === filtroFecha.value;
        let coincideNombre = r.cliente.toLowerCase().includes(buscarCliente.value.toLowerCase());
        return coincideEstado && coincideFecha && coincideNombre;
    });

    listaReservas.innerHTML = "";

    if (filtradas.length === 0) {
        listaReservas.innerHTML = `
            <div class="reservas-vacio">
                <div class="vacio-icon">📅</div>
                <h3>No hay reservas registradas</h3>
                <p>Las reservas aparecerán aquí cuando los clientes las realicen</p>
            </div>`;
        return;
    }

    filtradas.forEach(reserva => {
        const div = document.createElement("div");
        div.classList.add("reserva-item");
        div.innerHTML = `
            <div><strong>${reserva.cliente}</strong> (${reserva.personas} personas)</div>
            <div>${reserva.fecha} ${reserva.hora}</div>
            <div class="estado-visual ${reserva.estado}">${iconoEstado(reserva.estado)} ${capitalizar(reserva.estado)}</div>
            <button class="btn-cambiar-estado" data-id="${reserva.id}">Cambiar Estado</button>
        `;
        listaReservas.appendChild(div);
    });

    actualizarEstadisticas();
}

// ==== Función para actualizar estadísticas ====
function actualizarEstadisticas() {
    totalReservas.textContent = reservas.length;
    reservasPendientes.textContent = reservas.filter(r => r.estado === "pendiente").length;
    reservasConfirmadas.textContent = reservas.filter(r => r.estado === "confirmada").length;
    
    let hoy = new Date().toISOString().split("T")[0];
    personasHoy.textContent = reservas
        .filter(r => r.fecha === hoy)
        .reduce((acc, r) => acc + r.personas, 0);
}

// ==== Abrir modal para cambiar estado ====
document.addEventListener("click", e => {
    if (e.target.classList.contains("btn-cambiar-estado")) {
        let id = e.target.getAttribute("data-id");
        reservaSeleccionada = reservas.find(r => r.id == id);
        document.getElementById("reservaEstadoInfo").textContent = `${reservaSeleccionada.cliente} - ${reservaSeleccionada.fecha} ${reservaSeleccionada.hora}`;
        modalEstado.style.display = "flex";
    }
});

// ==== Cerrar modal ====
cerrarModalEstado.addEventListener("click", () => modalEstado.style.display = "none");

// ==== Confirmar cambio de estado ====
confirmarEstado.addEventListener("click", () => {
    let nuevoEstado = document.querySelector('input[name="nuevoEstado"]:checked');
    if (nuevoEstado && reservaSeleccionada) {
        reservaSeleccionada.estado = nuevoEstado.value;
        mostrarReservas();
        modalEstado.style.display = "none";
    }
});

// ==== Utilidades ====
function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function iconoEstado(estado) {
    switch (estado) {
        case "pendiente": return "⏳";
        case "confirmada": return "✅";
        case "completada": return "🎉";
        case "cancelada": return "❌";
        default: return "";
    }
}

// ==== Eventos de filtros ====
[filtroEstado, filtroFecha, buscarCliente].forEach(el => {
    el.addEventListener("input", mostrarReservas);
});

// ==== Inicializar ====
mostrarReservas();
