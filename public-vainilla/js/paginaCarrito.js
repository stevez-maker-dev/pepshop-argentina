async function crearItemCarrito(item) {
  const respuesta = await fetch(`/api/productos/${item.id}`);
  const producto = await respuesta.json();

  const subtotal = producto.precio * item.cantidad;

  return `
    <li class="carrito-item" data-id="${producto._id}">
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <div class="carrito-item-info">
        <h3>${producto.nombre}</h3>
        <p class="categoria">${producto.especie} · ${producto.categoria}</p>
        <p class="precio-unitario">$${producto.precio.toLocaleString('es-AR')} c/u</p>
      </div>
      <div class="cantidad-selector">
        <label for="cantidad-${producto._id}">Cantidad:</label>
        <input type="number" id="cantidad-${producto._id}" class="input-cantidad" data-id="${producto._id}" value="${item.cantidad}" min="1">
      </div>
      <p class="subtotal">$${subtotal.toLocaleString('es-AR')}</p>
      <button class="btn-eliminar" data-id="${producto._id}" aria-label="Eliminar producto del carrito">&times;</button>
    </li>
  `;
}

async function renderizarPaginaCarrito() {
  const carrito = obtenerCarrito();
  const lista = document.querySelector('.lista-carrito');
  const resumenSubtotal = document.querySelector('#resumen-subtotal');
  const resumenTotal = document.querySelector('#resumen-total');

  if (carrito.length === 0) {
    lista.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío.</p>';
    resumenSubtotal.textContent = '$0';
    resumenTotal.textContent = '$0';
    return;
  }

  try {
    const itemsHTML = await Promise.all(carrito.map(crearItemCarrito));
    lista.innerHTML = itemsHTML.join('');

    const total = carrito.reduce((acumulado, item, indice) => {
      const subtotalEl = lista.querySelectorAll('.subtotal')[indice];
      const valor = subtotalEl
        ? Number(subtotalEl.textContent.replace(/[^0-9]/g, ''))
        : 0;
      return acumulado + valor;
    }, 0);

    resumenSubtotal.textContent = `$${total.toLocaleString('es-AR')}`;
    resumenTotal.textContent = `$${total.toLocaleString('es-AR')}`;

  } catch (error) {
    lista.innerHTML = '<p class="carrito-vacio">Error al cargar el carrito.</p>';
    console.error('Error al cargar carrito:', error);
  }
}

function eliminarDelCarrito(idProducto) {
  const carrito = obtenerCarrito().filter(item => item.id !== idProducto);
  guardarCarrito(carrito);
}

function cambiarCantidad(idProducto, nuevaCantidad) {
  const carrito = obtenerCarrito();
  const item = carrito.find(i => i.id === idProducto);
  if (item) {
    item.cantidad = nuevaCantidad;
    guardarCarrito(carrito);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderizarPaginaCarrito();
  actualizarContadorCarrito();

  document.querySelector('.lista-carrito').addEventListener('click', async function(evento) {
    if (evento.target.classList.contains('btn-eliminar')) {
      const id = evento.target.dataset.id;
      eliminarDelCarrito(id);
      await renderizarPaginaCarrito();
      actualizarContadorCarrito();
    }
  });

  document.querySelector('.lista-carrito').addEventListener('change', async function(evento) {
    if (evento.target.classList.contains('input-cantidad')) {
      const id = evento.target.dataset.id;
      const nuevaCantidad = Math.max(1, Number(evento.target.value) || 1);
      cambiarCantidad(id, nuevaCantidad);
      await renderizarPaginaCarrito();
      actualizarContadorCarrito();
    }
  });
});