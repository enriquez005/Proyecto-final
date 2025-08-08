// ========== SISTEMA DE CARRITO DE COMPRAS - BENDITO CAFÉ ==========

// Precios de los productos
const precios = {
    // PANADERÍA
    "Pan de la Abuela": 3500,
    "Pan de masa madre": 4200,
    "Pancacho": 2800,
    
    // BEBIDAS
    "Café Latte": 4500,
    "Café late": 4500, // Variación del nombre
    "Café americano": 3800,
    "Malteada de Café": 6200,
    
    // POSTRES
    "Wafflebono": 7200,
    "Torta de Chocolate": 8500,
    "Cheesecake": 9200,
    
    // ANTOJOS
    "Alfajores": 2500,
    "Galletas": 1800
};

// Estado del carrito
let carrito = [];

// Elementos del DOM
const elementos = {
    toggleCarrito: null,
    carritoPanel: null,
    contadorItems: null,
    carritoItems: null,
    totalCarrito: null,
    modalPedido: null,
    formPedido: null
};

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", inicializarCarrito);

function inicializarCarrito() {
    // Obtener referencias de elementos
    elementos.toggleCarrito = document.getElementById("toggleCarrito");
    elementos.carritoPanel = document.getElementById("carritoPanel");
    elementos.contadorItems = document.getElementById("contadorItems");
    elementos.carritoItems = document.getElementById("carritoItems");
    elementos.totalCarrito = document.getElementById("totalCarrito");
    elementos.modalPedido = document.getElementById("modalPedido");
    elementos.formPedido = document.getElementById("formPedido");
    
    // Verificar que los elementos existen
    if (!elementos.toggleCarrito) {
        console.error("No se encontraron los elementos del carrito. Asegúrate de haber añadido el HTML del carrito.");
        return;
    }
    
    // Añadir botones de agregar a cada producto
    añadirBotonesAgregar();
    
    // Event listeners
    configurarEventListeners();
    
    // Cargar carrito desde localStorage
    cargarCarritoGuardado();
    
    console.log("🛒 Sistema de carrito inicializado correctamente");
}

function añadirBotonesAgregar() {
    const productos = document.querySelectorAll(".lista-productos li");
    
    productos.forEach(producto => {
        const nombreProducto = producto.textContent.trim();
        const precio = precios[nombreProducto];
        
        if (precio) {
            // Crear botón de agregar
            const btnAgregar = document.createElement("button");
            btnAgregar.className = "btn-agregar";
            btnAgregar.textContent = `+$${precio.toLocaleString()}`;
            btnAgregar.onclick = (e) => {
                e.stopPropagation();
                agregarAlCarrito(nombreProducto, precio);
            };
            
            producto.appendChild(btnAgregar);
        }
    });
}

function configurarEventListeners() {
    // Toggle carrito
    elementos.toggleCarrito.addEventListener("click", toggleCarrito);
    
    // Cerrar carrito
    document.getElementById("cerrarCarrito").addEventListener("click", cerrarCarrito);
    
    // Limpiar carrito
    document.getElementById("limpiarCarrito").addEventListener("click", limpiarCarrito);
    
    // Realizar pedido
    document.getElementById("realizarPedido").addEventListener("click", abrirModalPedido);
    
    // Modal
    document.getElementById("cerrarModal").addEventListener("click", cerrarModal);
    document.getElementById("cancelarPedido").addEventListener("click", cerrarModal);
    elementos.formPedido.addEventListener("submit", procesarPedido);
    
    // Cerrar al hacer click fuera
    elementos.modalPedido.addEventListener("click", (e) => {
        if (e.target === elementos.modalPedido) {
            cerrarModal();
        }
    });
    
    // Cerrar carrito al hacer click fuera
    document.addEventListener("click", (e) => {
        if (!e.target.closest(".carrito-container")) {
            cerrarCarrito();
        }
    });
}

function agregarAlCarrito(nombre, precio) {
    const itemExistente = carrito.find(item => item.nombre === nombre);
    
    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({
            nombre: nombre,
            precio: precio,
            cantidad: 1
        });
    }
    
    actualizarCarrito();
    guardarCarrito();
    mostrarNotificacion(`✅ ${nombre} añadido al carrito`);
}

function eliminarDelCarrito(nombre) {
    carrito = carrito.filter(item => item.nombre !== nombre);
    actualizarCarrito();
    guardarCarrito();
}

function cambiarCantidad(nombre, nuevaCantidad) {
    const item = carrito.find(item => item.nombre === nombre);
    if (item) {
        if (nuevaCantidad <= 0) {
            eliminarDelCarrito(nombre);
        } else {
            item.cantidad = nuevaCantidad;
            actualizarCarrito();
            guardarCarrito();
        }
    }
}

function actualizarCarrito() {
    // Actualizar contador
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    elementos.contadorItems.textContent = totalItems;
    
    // Actualizar contenido del carrito
    if (carrito.length === 0) {
        elementos.carritoItems.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío</p>';
    } else {
        elementos.carritoItems.innerHTML = carrito.map(item => `
            <div class="item-carrito">
                <div class="item-info">
                    <div class="item-nombre">${item.nombre}</div>
                    <div class="item-precio">$${item.precio.toLocaleString()} c/u</div>
                </div>
                <div class="item-controles">
                    <button class="btn-cantidad" onclick="cambiarCantidad('${item.nombre}', ${item.cantidad - 1})">-</button>
                    <span class="cantidad">${item.cantidad}</span>
                    <button class="btn-cantidad" onclick="cambiarCantidad('${item.nombre}', ${item.cantidad + 1})">+</button>
                    <button class="btn-eliminar" onclick="eliminarDelCarrito('${item.nombre}')" title="Eliminar">🗑️</button>
                </div>
            </div>
        `).join('');
    }
    
    // Actualizar total
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    elementos.totalCarrito.textContent = total.toLocaleString();
}

function toggleCarrito() {
    elementos.carritoPanel.classList.toggle("activo");
}

function cerrarCarrito() {
    elementos.carritoPanel.classList.remove("activo");
}

function limpiarCarrito() {
    if (carrito.length > 0 && confirm("¿Estás seguro de que quieres limpiar el carrito?")) {
        carrito = [];
        actualizarCarrito();
        guardarCarrito();
        mostrarNotificacion("🧹 Carrito limpiado");
    }
}

function abrirModalPedido() {
    if (carrito.length === 0) {
        mostrarNotificacion("❌ Tu carrito está vacío");
        return;
    }
    
    // Llenar resumen del pedido
    const resumenItems = document.getElementById("resumenItems");
    const totalFinal = document.getElementById("totalFinal");
    
    resumenItems.innerHTML = carrito.map(item => `
        <div class="resumen-item">
            <span>${item.nombre} x${item.cantidad}</span>
            <span>$${(item.precio * item.cantidad).toLocaleString()}</span>
        </div>
    `).join('');
    
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    totalFinal.textContent = total.toLocaleString();
    
    elementos.modalPedido.classList.add("activo");
    cerrarCarrito();
}

function cerrarModal() {
    elementos.modalPedido.classList.remove("activo");
    elementos.formPedido.reset();
}

function procesarPedido(e) {
    e.preventDefault();
    
    const datosCliente = {
        nombre: document.getElementById("nombreCliente").value,
        telefono: document.getElementById("telefonoCliente").value,
        direccion: document.getElementById("direccionCliente").value,
        observaciones: document.getElementById("observaciones").value
    };
    
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    
    // Crear mensaje de WhatsApp
    const mensaje = crearMensajeWhatsApp(datosCliente, carrito, total);
    
    // Abrir WhatsApp
    const numeroWhatsApp = "573137348104"; // Cambiar por tu número
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
    
    // Limpiar carrito y cerrar modal
    carrito = [];
    actualizarCarrito();
    guardarCarrito();
    cerrarModal();
    
    mostrarNotificacion("🎉 ¡Pedido enviado! Te contactaremos pronto.");
}

function crearMensajeWhatsApp(cliente, items, total) {
    let mensaje = `🍰 *NUEVO PEDIDO - BENDITO CAFÉ* 🍰\n\n`;
    mensaje += `👤 *Cliente:* ${cliente.nombre}\n`;
    mensaje += `📱 *Teléfono:* ${cliente.telefono}\n`;
    mensaje += `📍 *Dirección:* ${cliente.direccion}\n\n`;
    
    mensaje += `📋 *PRODUCTOS:*\n`;
    items.forEach(item => {
        mensaje += `• ${item.nombre} x${item.cantidad} - $${(item.precio * item.cantidad).toLocaleString()}\n`;
    });
    
    mensaje += `\n💰 *TOTAL: $${total.toLocaleString()}*\n\n`;
    
    if (cliente.observaciones) {
        mensaje += `📝 *Observaciones:* ${cliente.observaciones}\n\n`;
    }
    
    mensaje += `⏰ Pedido realizado: ${new Date().toLocaleString()}\n`;
    mensaje += `¡Gracias por elegir Bendito Café! ☕`;
    
    return mensaje;
}

function mostrarNotificacion(mensaje) {
    // Crear elemento de notificación
    const notificacion = document.createElement("div");
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(145deg, #28a745, #20a040);
        color: white;
        padding: 12px 20px;
        border-radius: 25px;
        box-shadow: 0 4px 15px rgba(40, 167, 69, 0.4);
        z-index: 3000;
        font-weight: bold;
        animation: slideDown 0.3s ease;
    `;
    notificacion.textContent = mensaje;
    
    document.body.appendChild(notificacion);
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
        notificacion.style.animation = "slideUp 0.3s ease";
        setTimeout(() => {
            if (notificacion.parentNode) {
                notificacion.parentNode.removeChild(notificacion);
            }
        }, 300);
    }, 3000);
}

function guardarCarrito() {
    localStorage.setItem("benditoCafeCarrito", JSON.stringify(carrito));
}

function cargarCarritoGuardado() {
    const carritoGuardado = localStorage.getItem("benditoCafeCarrito");
    if (carritoGuardado) {
        try {
            carrito = JSON.parse(carritoGuardado);
            actualizarCarrito();
        } catch (e) {
            console.warn("Error al cargar carrito guardado:", e);
            carrito = [];
        }
    }
}

// Hacer funciones globales para los event handlers inline
window.cambiarCantidad = cambiarCantidad;
window.eliminarDelCarrito = eliminarDelCarrito;

// Estilos CSS para las animaciones de notificación
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from { transform: translate(-50%, -100%); opacity: 0; }
        to { transform: translate(-50%, 0); opacity: 1; }
    }
    @keyframes slideUp {
        from { transform: translate(-50%, 0); opacity: 1; }
        to { transform: translate(-50%, -100%); opacity: 0; }
    }
`;
document.head.appendChild(style);