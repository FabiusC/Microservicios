const API_URL = 'http://localhost:8082/api/productos';

const tbody = document.getElementById('productos-tbody');
const form = document.getElementById('producto-form');
const msg = document.getElementById('msg');
const cancelarBtn = document.getElementById('cancelar');

function mostrarMensaje(texto, error = false) {
    msg.textContent = texto;
    msg.style.color = error ? 'red' : 'green';
    setTimeout(() => { msg.textContent = ''; }, 2500);
}

function limpiarFormulario() {
    form.reset();
    document.getElementById('producto-id').value = '';
    form.querySelector('button[type="submit"]').textContent = 'Agregar';
    cancelarBtn.style.display = 'none';
}

function llenarFormulario(producto) {
    document.getElementById('producto-id').value = producto.id;
    document.getElementById('nombre').value = producto.nombre;
    document.getElementById('precio').value = producto.precio;
    document.getElementById('stock').value = producto.stock;
    form.querySelector('button[type="submit"]').textContent = 'Actualizar';
    cancelarBtn.style.display = 'inline';
}

function renderProductos(productos) {
    tbody.innerHTML = '';
    productos.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.nombre}</td>
      <td>${p.precio}</td>
      <td>${p.stock}</td>
      <td>${p.fecha_creacion || ''}</td>
      <td class="actions">
        <button onclick='editarProducto(${JSON.stringify(p)})'>Editar</button>
        <button onclick='eliminarProducto(${p.id})' style='color:red;'>Eliminar</button>
      </td>
    `;
        tbody.appendChild(tr);
    });
}

function obtenerProductos() {
    fetch(API_URL)
        .then(res => res.json())
        .then(renderProductos)
        .catch(() => mostrarMensaje('Error al cargar productos', true));
}

window.editarProducto = function (producto) {
    llenarFormulario(producto);
};

window.eliminarProducto = function (id) {
    if (!confirm('¿Seguro que deseas eliminar este producto?')) return;
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
        .then(res => {
            if (!res.ok) throw new Error();
            mostrarMensaje('Producto eliminado');
            obtenerProductos();
        })
        .catch(() => mostrarMensaje('Error al eliminar producto', true));
};

form.onsubmit = function (e) {
    e.preventDefault();
    const id = document.getElementById('producto-id').value;
    const nombre = document.getElementById('nombre').value;
    const precio = document.getElementById('precio').value;
    const stock = document.getElementById('stock').value;
    if (!nombre || !precio || !stock) {
        mostrarMensaje('Todos los campos son obligatorios', true);
        return;
    }
    const producto = {
        nombre,
        precio: parseFloat(precio),
        stock: parseInt(stock)
    };
    if (id) {
        // Editar
        fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(producto)
        })
            .then(res => {
                if (!res.ok) throw new Error();
                mostrarMensaje('Producto actualizado');
                limpiarFormulario();
                obtenerProductos();
            })
            .catch(() => mostrarMensaje('Error al actualizar producto', true));
    } else {
        // Agregar
        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(producto)
        })
            .then(res => {
                if (!res.ok) throw new Error();
                mostrarMensaje('Producto agregado');
                limpiarFormulario();
                obtenerProductos();
            })
            .catch(() => mostrarMensaje('Error al agregar producto', true));
    }
};

cancelarBtn.onclick = function () {
    limpiarFormulario();
};

// Inicializar
obtenerProductos(); 