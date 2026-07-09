function obtenerToken() {
  return localStorage.getItem('token');
}

function cabeceras() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${obtenerToken()}`
  };
}

async function verificarAccesoAdmin() {
  const sesion = obtenerSesion();
  if (!sesion || sesion.usuario.rol !== 'admin') {
    alert('Acceso denegado. Solo administradores.');
    window.location.href = 'index.html';
  }
}

async function cargarProductos() {
  const respuesta = await fetch('/api/productos');
  const productos = await respuesta.json();
  const tbody = document.querySelector('#tabla-productos tbody');

  tbody.innerHTML = productos.map(p => `
    <tr>
      <td>${p.nombre}</td>
      <td>${p.especie}</td>
      <td>${p.categoria}</td>
      <td>$${p.precio.toLocaleString('es-AR')}</td>
      <td>${p.stock}</td>
      <td class="acciones-celda">
        <button class="btn-editar" data-id="${p._id}">Editar</button>
        <button class="btn-eliminar-prod" data-id="${p._id}">Eliminar</button>
      </td>
    </tr>
  `).join('');
}

async function cargarOrdenes() {
  const respuesta = await fetch('/api/admin/ordenes', { headers: cabeceras() });
  const ordenes = await respuesta.json();
  const tbody = document.querySelector('#tabla-ordenes tbody');

  tbody.innerHTML = ordenes.map(o => `
    <tr>
      <td class="id-corto">${o._id.slice(-6)}</td>
      <td>${o.usuario ? o.usuario.nombre : 'Usuario eliminado'}</td>
      <td>$${o.total.toLocaleString('es-AR')}</td>
      <td><span class="badge-estado badge-${o.estado}">${o.estado}</span></td>
      <td>${new Date(o.createdAt).toLocaleDateString('es-AR')}</td>
    </tr>
  `).join('');
}

function mostrarFormulario(producto = null) {
  const form = document.querySelector('#form-producto');
  const titulo = document.querySelector('#form-producto-titulo');

  document.querySelector('#producto-id').value = producto ? producto._id : '';
  document.querySelector('#p-nombre').value = producto ? producto.nombre : '';
  document.querySelector('#p-precio').value = producto ? producto.precio : '';
  document.querySelector('#p-especie').value = producto ? producto.especie : 'Perro';
  document.querySelector('#p-categoria').value = producto ? producto.categoria : 'Alimento';
  document.querySelector('#p-stock').value = producto ? producto.stock : '';
  document.querySelector('#p-imagen').value = producto ? producto.imagen : '';
  document.querySelector('#p-descripcion').value = producto ? producto.descripcion : '';

  titulo.textContent = producto ? 'Editar producto' : 'Nuevo producto';
  form.style.display = 'block';
  form.scrollIntoView({ behavior: 'smooth' });
}

function ocultarFormulario() {
  document.querySelector('#form-producto').style.display = 'none';
}

async function guardarProducto() {
  const id = document.querySelector('#producto-id').value;
  const datos = {
    nombre: document.querySelector('#p-nombre').value,
    precio: Number(document.querySelector('#p-precio').value),
    especie: document.querySelector('#p-especie').value,
    categoria: document.querySelector('#p-categoria').value,
    stock: Number(document.querySelector('#p-stock').value),
    imagen: document.querySelector('#p-imagen').value,
    descripcion: document.querySelector('#p-descripcion').value
  };

  const url = id ? `/api/admin/productos/${id}` : '/api/admin/productos';
  const method = id ? 'PUT' : 'POST';

  const respuesta = await fetch(url, {
    method,
    headers: cabeceras(),
    body: JSON.stringify(datos)
  });

  if (respuesta.ok) {
    ocultarFormulario();
    cargarProductos();
  } else {
    const error = await respuesta.json();
    alert(error.error);
  }
}

async function eliminarProducto(id) {
  if (!confirm('¿Seguro que querés eliminar este producto?')) return;

  const respuesta = await fetch(`/api/admin/productos/${id}`, {
    method: 'DELETE',
    headers: cabeceras()
  });

  if (respuesta.ok) {
    cargarProductos();
  } else {
    alert('Error al eliminar el producto');
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await verificarAccesoAdmin();

  cargarProductos();

  document.querySelector('.admin-tabs').addEventListener('click', function(e) {
    if (!e.target.classList.contains('tab-btn')) return;

    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('tab-activo'));
    document.querySelectorAll('.tab-contenido').forEach(s => s.style.display = 'none');

    e.target.classList.add('tab-activo');
    const tab = e.target.dataset.tab;
    document.querySelector(`#tab-${tab}`).style.display = 'block';

    if (tab === 'ordenes') cargarOrdenes();
  });

  document.querySelector('#btn-nuevo-producto').addEventListener('click', () => mostrarFormulario());
  document.querySelector('#btn-cancelar-producto').addEventListener('click', ocultarFormulario);
  document.querySelector('#btn-guardar-producto').addEventListener('click', guardarProducto);

  document.querySelector('#tabla-productos').addEventListener('click', async function(e) {
    const id = e.target.dataset.id;
    if (e.target.classList.contains('btn-editar')) {
      const respuesta = await fetch(`/api/productos/${id}`);
      const producto = await respuesta.json();
      mostrarFormulario(producto);
    }
    if (e.target.classList.contains('btn-eliminar-prod')) {
      eliminarProducto(id);
    }
  });
});