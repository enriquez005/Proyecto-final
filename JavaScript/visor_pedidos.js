// ========== VISOR DE PEDIDOS - BENDITO CAFÉ ==========

// Estado global del visor
let pedidos = [];
let pedidoSeleccionado = null;
let filtros = {
    estado: 'todos',
    fecha: '',
    cliente: ''
};

// Elementos del DOM
const elementos = {
    // Estadísticas
    totalPedidos: null,
    pedidosPendientes: null,
    pedidosCompletados: null,
    totalVentas: null,
    
    // Filtros
    filtroEstado: null,
    filtroFecha: null,
    buscarCliente: null,
    
    // Lista de pedidos
    listaPedidos: null,
    
    // Modales
    modalDetalle: null,
    modalEstado: null,
    
    // Otros controles
    limpiarPedidos: null,
    exportarPedidos: null
};

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", inicializarVisor);

function inicializarVisor() {
    console.log("🚀 Inicializando Visor de Pedidos...");
    
    // Obtener referencias de elementos del DOM
    obtenerElementosDOM();
    
    // Configurar event listeners
    configurarEventListeners();
    
    // Cargar pedidos guardados
    cargarPedidosGuardados();
    
    // Actualizar la vista inicial
    actualizarVista();
    
    console.log("✅ Visor de Pedidos inicializado correctamente");
}

function obtenerElementosDOM() {
    // Estadísticas
    elementos.totalPedidos = document.getElementById("totalPedidos");
    elementos.pedidosPendientes = document.getElementById("pedidosPendientes");
    elementos.pedidosCompletados = document.getElementById("pedidosCompletados");
    elementos.totalVentas = document.getElementById("totalVentas");
    
    // Filtros
    elementos.filtroEstado = document.getElementById("filtroEstado");
    elementos.filtroFecha = document.getElementById("filtroFecha");
    elementos.buscarCliente = document.getElementById("buscarCliente");
    
    // Lista
    elementos.listaPedidos = document.getElementById("listaPedidos");
    
    // Modales
    elementos.modalDetalle = document.getElementById("modalDetalle");
    elementos.modalEstado = document.getElementById("modalEstado");
    
    // Controles
    elementos.limpiarPedidos = document.getElementById("limpiarPedidos");
    elementos.exportarPedidos = document.getElementById("exportarPedidos");
}

function configurarEventListeners() {
    // Filtros
    elementos.filtroEstado.addEventListener("change", aplicarFiltros);
    elementos.filtroFecha.addEventListener("change", aplicarFiltros);
    elementos.buscarCliente.addEventListener("input", aplicarFiltros);
    
    // Botones de control
    elementos.limpiarPedidos.addEventListener("click", limpiarTodosPedidos);
    elementos.exportarPedidos.addEventListener("click", exportarPedidos);
    
    // Modal de detalles
    document.getElementById("cerrarModalDetalle").addEventListener("click", cerrarModalDetalle);
    document.getElementById("cerrarDetalle").addEventListener("click", cerrarModalDetalle);
    document.getElementById("imprimirPedido").addEventListener("click", imprimirPedido);
    
    // Modal de estado
    document.getElementById("cerrarModalEstado").addEventListener("click", cerrarModalEstado);
    document.getElementById("cancelarEstado").addEventListener("click", cerrarModalEstado);
    document.getElementById("confirmarEstado").addEventListener("click", confirmarCambioEstado);
    
    // Cerrar modales al hacer click fuera
    elementos.modalDetalle.addEventListener("click", (e) => {
        if (e.target === elementos.modalDetalle) cerrarModalDetalle();
    });
    
    elementos.modalEstado.addEventListener("click", (e) => {
        if (e.target === elementos.modalEstado) cerrarModalEstado();
    });
    
    // Escuchar nuevos pedidos desde localStorage
    window.addEventListener("storage", (e) => {
        if (e.key === "benditoCafePedidos") {
            cargarPedidosGuardados();
            actualizarVista();
        }
    });
    
    // Polling para detectar nuevos pedidos cada 5 segundos
    setInterval(() => {
        cargarPedidosGuardados();
        actualizarVista();
    }, 5000);
}

function cargarPedidosGuardados() {
    try {
        const pedidosGuardados = localStorage.getItem("benditoCafePedidos");
        if (pedidosGuardados) {
            pedidos = JSON.parse(pedidosGuardados);
        } else {
            pedidos = [];
        }
    } catch (error) {
        console.error("Error al cargar pedidos:", error);
        pedidos = [];
    }
}

function guardarPedidos() {
    try {
        localStorage.setItem("benditoCafePedidos", JSON.stringify(pedidos));
    } catch (error) {
        console.error("Error al guardar pedidos:", error);
    }
}

function agregarPedido(nuevoPedido) {
    // Generar ID único para el pedido
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    
    const pedido = {
        id: id,
        fecha: new Date().toISOString(),
        estado: "pendiente",
        cliente: nuevoPedido.cliente,
        productos: nuevoPedido.productos,
        total: nuevoPedido.total,
        observaciones: nuevoPedido.observaciones || ""
    };
    
    pedidos.unshift(pedido); // Agregar al inicio
    guardarPedidos();
    actualizarVista();
    
    return id;
}

function actualizarVista() {
    actualizarEstadisticas();
    mostrarPedidos();
}

function actualizarEstadisticas() {
    // Calcular estadísticas
    const total = pedidos.length;
    const pendientes = pedidos.filter(p => p.estado === "pendiente" || p.estado === "preparando").length;
    const completados = pedidos.filter(p => p.estado === "entregado").length;
    const totalVentas = pedidos
        .filter(p => p.estado !== "cancelado")
        .reduce((sum, p) => sum + p.total, 0);
    
    // Actualizar elementos del DOM
    elementos.totalPedidos.textContent = total;
    elementos.pedidosPendientes.textContent = pendientes;
    elementos.pedidosCompletados.textContent = completados;
    elementos.totalVentas.textContent = `${totalVentas.toLocaleString()}`;
}

function filtrarPedidos() {
    let pedidosFiltrados = [...pedidos];
    
    // Filtro por estado
    if (filtros.estado !== "todos") {
        pedidosFiltrados = pedidosFiltrados.filter(p => p.estado === filtros.estado);
    }
    
    // Filtro por fecha
    if (filtros.fecha) {
        const fechaFiltro = new Date(filtros.fecha).toDateString();
        pedidosFiltrados = pedidosFiltrados.filter(p => {
            const fechaPedido = new Date(p.fecha).toDateString();
            return fechaPedido === fechaFiltro;
        });
    }
    
    // Filtro por cliente
    if (filtros.cliente) {
        const busqueda = filtros.cliente.toLowerCase();
        pedidosFiltrados = pedidosFiltrados.filter(p => 
            p.cliente.nombre.toLowerCase().includes(busqueda) ||
            p.cliente.telefono.includes(busqueda)
        );
    }
    
    return pedidosFiltrados;
}

function mostrarPedidos() {
    const pedidosFiltrados = filtrarPedidos();
    
    if (pedidosFiltrados.length === 0) {
        elementos.listaPedidos.innerHTML = `
            <div class="pedidos-vacio">
                <div class="vacio-icon">📋</div>
                <h3>No hay pedidos que mostrar</h3>
                <p>No se encontraron pedidos con los filtros aplicados</p>
            </div>
        `;
        return;
    }
    
    elementos.listaPedidos.innerHTML = pedidosFiltrados
        .map(pedido => crearTarjetaPedido(pedido))
        .join("");
}

function crearTarjetaPedido(pedido) {
    const fecha = new Date(pedido.fecha);
    const fechaFormateada = fecha.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit", 
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
    
    const productosHTML = pedido.productos
        .map(producto => `
            <div class="producto-item">
                • ${producto.nombre} x${producto.cantidad} - ${(producto.precio * producto.cantidad).toLocaleString()}
            </div>
        `)
        .join("");
    
    const estadoClass = `estado-${pedido.estado}`;
    const estadoTexto = obtenerTextoEstado(pedido.estado);
    
    return `
        <div class="pedido-card" data-id="${pedido.id}">
            <div class="pedido-header">
                <div class="pedido-info">
                    <h4>👤 ${pedido.cliente.nombre}</h4>
                    <div class="pedido-id">ID: ${pedido.id}</div>
                    <div class="pedido-fecha">📅 ${fechaFormateada}</div>
                </div>
                <div class="pedido-estado ${estadoClass}" onclick="abrirModalEstado('${pedido.id}')">
                    ${estadoTexto}
                </div>
            </div>
            
            <div class="pedido-cuerpo">
                <div class="pedido-productos">
                    <h5>🛒 Productos:</h5>
                    ${productosHTML}
                </div>
                
                <div class="pedido-cliente">
                    <div class="cliente-info">
                        <strong>📱 Teléfono:</strong> ${pedido.cliente.telefono}
                    </div>
                    <div class="cliente-info">
                        <strong>📍 Dirección:</strong> ${pedido.cliente.direccion}
                    </div>
                    ${pedido.observaciones ? `
                        <div class="cliente-info">
                            <strong>💭 Observaciones:</strong><br>
                            ${pedido.observaciones}
                        </div>
                    ` : ""}
                    
                    <div class="pedido-total">
                        💰 Total: ${pedido.total.toLocaleString()}
                    </div>
                </div>
            </div>
            
            <div class="pedido-acciones">
                <button class="btn-pedido btn-ver" onclick="verDetallePedido('${pedido.id}')">
                    👁️ Ver Detalle
                </button>
                <button class="btn-pedido btn-estado" onclick="abrirModalEstado('${pedido.id}')">
                    🔄 Estado
                </button>
                <button class="btn-pedido btn-eliminar" onclick="eliminarPedido('${pedido.id}')">
                    🗑️ Eliminar
                </button>
            </div>
        </div>
    `;
}

function obtenerTextoEstado(estado) {
    const estados = {
        "pendiente": "⏳ Pendiente",
        "preparando": "👨‍🍳 Preparando", 
        "listo": "✅ Listo",
        "entregado": "📦 Entregado",
        "cancelado": "❌ Cancelado"
    };
    return estados[estado] || estado;
}

function aplicarFiltros() {
    filtros.estado = elementos.filtroEstado.value;
    filtros.fecha = elementos.filtroFecha.value;
    filtros.cliente = elementos.buscarCliente.value;
    
    mostrarPedidos();
}

function verDetallePedido(id) {
    const pedido = pedidos.find(p => p.id === id);
    if (!pedido) return;
    
    const fecha = new Date(pedido.fecha);
    const fechaFormateada = fecha.toLocaleDateString("es-ES", {
        weekday: "long",
        day: "2-digit", 
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
    
    const productosHTML = pedido.productos
        .map(producto => `
            <tr>
                <td>${producto.nombre}</td>
                <td>${producto.cantidad}</td>
                <td>${producto.precio.toLocaleString()}</td>
                <td><strong>${(producto.precio * producto.cantidad).toLocaleString()}</strong></td>
            </tr>
        `)
        .join("");
    
    const contenido = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <div style="text-align: center; margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                <h2 style="color: #654321; margin: 0;">🍰 Bendito Café</h2>
                <p style="margin: 5px 0; color: #666;">Pedido ID: <code>${pedido.id}</code></p>
                <p style="margin: 0; color: #666;">📅 ${fechaFormateada}</p>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h4 style="color: #654321; border-bottom: 2px solid #d2691e; padding-bottom: 5px;">
                    👤 Información del Cliente
                </h4>
                <p><strong>Nombre:</strong> ${pedido.cliente.nombre}</p>
                <p><strong>Teléfono:</strong> ${pedido.cliente.telefono}</p>
                <p><strong>Dirección:</strong> ${pedido.cliente.direccion}</p>
                <p><strong>Estado:</strong> <span style="background: #f0f0f0; padding: 3px 8px; border-radius: 4px;">${obtenerTextoEstado(pedido.estado)}</span></p>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h4 style="color: #654321; border-bottom: 2px solid #d2691e; padding-bottom: 5px;">
                    🛒 Productos Pedidos
                </h4>
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                    <thead>
                        <tr style="background: #f8f9fa;">
                            <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Producto</th>
                            <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Cant.</th>
                            <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Precio Unit.</th>
                            <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${productosHTML}
                    </tbody>
                </table>
            </div>
            
            <div style="text-align: right; margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                <h3 style="color: #d2691e; margin: 0;">
                    💰 Total: ${pedido.total.toLocaleString()}
                </h3>
            </div>
            
            ${pedido.observaciones ? `
                <div style="margin-top: 20px;">
                    <h4 style="color: #654321; border-bottom: 2px solid #d2691e; padding-bottom: 5px;">
                        💭 Observaciones
                    </h4>
                    <p style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #d2691e;">
                        ${pedido.observaciones}
                    </p>
                </div>
            ` : ""}
        </div>
    `;
    
    document.getElementById("contenidoDetalle").innerHTML = contenido;
    pedidoSeleccionado = pedido;
    elementos.modalDetalle.classList.add("activo");
}

function abrirModalEstado(id) {
    const pedido = pedidos.find(p => p.id === id);
    if (!pedido) return;
    
    pedidoSeleccionado = pedido;
    document.getElementById("pedidoEstadoInfo").textContent = 
        `${pedido.cliente.nombre} - ${pedido.total.toLocaleString()}`;
    
    // Seleccionar el estado actual
    const radioActual = document.querySelector(`input[name="nuevoEstado"][value="${pedido.estado}"]`);
    if (radioActual) {
        radioActual.checked = true;
    }
    
    elementos.modalEstado.classList.add("activo");
}

function confirmarCambioEstado() {
    if (!pedidoSeleccionado) return;
    
    const nuevoEstado = document.querySelector('input[name="nuevoEstado"]:checked');
    if (!nuevoEstado) {
        mostrarNotificacion("❌ Por favor selecciona un estado", "error");
        return;
    }
    
    // Actualizar el estado del pedido
    const pedido = pedidos.find(p => p.id === pedidoSeleccionado.id);
    if (pedido) {
        pedido.estado = nuevoEstado.value;
        guardarPedidos();
        actualizarVista();
        cerrarModalEstado();
        
        mostrarNotificacion(
            `✅ Estado actualizado a: ${obtenerTextoEstado(nuevoEstado.value)}`,
            "exito"
        );
    }
}

function eliminarPedido(id) {
    const pedido = pedidos.find(p => p.id === id);
    if (!pedido) return;
    
    if (confirm(`¿Estás seguro de eliminar el pedido de ${pedido.cliente.nombre}?`)) {
        pedidos = pedidos.filter(p => p.id !== id);
        guardarPedidos();
        actualizarVista();
        mostrarNotificacion("🗑️ Pedido eliminado correctamente", "exito");
    }
}

function limpiarTodosPedidos() {
    if (pedidos.length === 0) {
        mostrarNotificacion("ℹ️ No hay pedidos para limpiar", "info");
        return;
    }
    
    if (confirm(`¿Estás seguro de eliminar TODOS los ${pedidos.length} pedidos? Esta acción no se puede deshacer.`)) {
        pedidos = [];
        guardarPedidos();
        actualizarVista();
        mostrarNotificacion("🧹 Todos los pedidos han sido eliminados", "exito");
    }
}

function exportarPedidos() {
    if (pedidos.length === 0) {
        mostrarNotificacion("ℹ️ No hay pedidos para exportar", "info");
        return;
    }
    
    const pedidosFiltrados = filtrarPedidos();
    const csv = generarCSV(pedidosFiltrados);
    descargarCSV(csv, `pedidos_bendito_cafe_${new Date().toISOString().split('T')[0]}.csv`);
    
    mostrarNotificacion("📊 Pedidos exportados correctamente", "exito");
}

function generarCSV(pedidos) {
    const headers = ["ID", "Fecha", "Cliente", "Teléfono", "Dirección", "Estado", "Productos", "Total", "Observaciones"];
    
    const filas = pedidos.map(pedido => {
        const fecha = new Date(pedido.fecha).toLocaleString("es-ES");
        const productos = pedido.productos
            .map(p => `${p.nombre} x${p.cantidad}`)
            .join("; ");
        
        return [
            pedido.id,
            fecha,
            pedido.cliente.nombre,
            pedido.cliente.telefono,
            pedido.cliente.direccion,
            pedido.estado,
            productos,
            pedido.total,
            pedido.observaciones || ""
        ];
    });
    
    const csvContent = [headers, ...filas]
        .map(fila => fila.map(campo => `"${campo}"`).join(","))
        .join("\n");
    
    return csvContent;
}

function descargarCSV(contenido, nombreArchivo) {
    const blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", nombreArchivo);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

function imprimirPedido() {
    if (!pedidoSeleccionado) return;
    
    const contenido = document.getElementById("contenidoDetalle").innerHTML;
    const ventanaImpresion = window.open("", "_blank");
    
    ventanaImpresion.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Pedido ${pedidoSeleccionado.id} - Bendito Café</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                @media print {
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            ${contenido}
        </body>
        </html>
    `);
    
    ventanaImpresion.document.close();
    ventanaImpresion.focus();
    
    // Esperar a que cargue y luego imprimir
    setTimeout(() => {
        ventanaImpresion.print();
        ventanaImpresion.close();
    }, 500);
}

function cerrarModalDetalle() {
    elementos.modalDetalle.classList.remove("activo");
    pedidoSeleccionado = null;
}

function cerrarModalEstado() {
    elementos.modalEstado.classList.remove("activo");
    pedidoSeleccionado = null;
    
    // Limpiar selección de radios
    document.querySelectorAll('input[name="nuevoEstado"]').forEach(radio => {
        radio.checked = false;
    });
}

function mostrarNotificacion(mensaje, tipo = "info") {
    const colores = {
        "exito": "#28a745",
        "error": "#dc3545", 
        "info": "#17a2b8",
        "warning": "#ffc107"
    };
    
    const notificacion = document.createElement("div");
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colores[tipo] || colores.info};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        font-weight: bold;
        max-width: 300px;
        animation: slideInRight 0.3s ease;
    `;
    notificacion.textContent = mensaje;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.style.animation = "slideOutRight 0.3s ease";
        setTimeout(() => {
            if (notificacion.parentNode) {
                notificacion.parentNode.removeChild(notificacion);
            }
        }, 300);
    }, 4000);
}

// Hacer funciones globales para event handlers inline
window.verDetallePedido = verDetallePedido;
window.abrirModalEstado = abrirModalEstado;
window.eliminarPedido = eliminarPedido;
window.agregarPedido = agregarPedido;

// Estilos CSS para animaciones de notificación
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
