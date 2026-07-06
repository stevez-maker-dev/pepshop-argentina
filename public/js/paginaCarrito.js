function crearItemCarrito(item) {
  const producto = productos.find(p => p.id === item.id);
  if (!producto) return '';

  const subtotal = producto.precio * item.cantidad;

  return `
    <li class="carrito-item" data-id="${producto.id}">
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <div class="carrito-item-info">
        <h3>${producto.nombre}</h3>
        <p class="categoria">${producto.especie} · ${producto.categoria}</p>
        <p class="precio-unitario">$${producto.precio.toLocaleString('es-AR')} c/u</p>
      </div>
      <div class="cantidad-selector">
        <label for="cantidad-${producto.id}">Cantidad:</label>
        <input type="number" id="cantidad-${producto.id}" class="input-cantidad" data-id="${producto.id}" value="${item.cantidad}" min="1">
      </div>
      <p class="subtotal">$${subtotal.toLocaleString('es-AR')}</p>
      <button class="btn-eliminar" data-id="${producto.id}" aria-label="Eliminar producto del carrito">&times;</button>
    </li>
  `;
}

function renderizarPaginaCarrito() {
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

  lista.innerHTML = carrito.map(crearItemCarrito).join('');

  const total = carrito.reduce((acumulado, item) => {
    const producto = productos.find(p => p.id === item.id);
    return acumulado + (producto ? producto.precio * item.cantidad : 0);
  }, 0);

  resumenSubtotal.textContent = `$${total.toLocaleString('es-AR')}`;
  resumenTotal.textContent = `$${total.toLocaleString('es-AR')}`;
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

document.querySelector('.lista-carrito').addEventListener('click', function(evento) {
  if (evento.target.classList.contains('btn-eliminar')) {
    const id = Number(evento.target.dataset.id);
    eliminarDelCarrito(id);
    renderizarPaginaCarrito();
    actualizarContadorCarrito();
  }
});

document.querySelector('.lista-carrito').addEventListener('change', function(evento) {
  if (evento.target.classList.contains('input-cantidad')) {
    const id = Number(evento.target.dataset.id);
    const nuevaCantidad = Math.max(1, Number(evento.target.value) || 1);
    cambiarCantidad(id, nuevaCantidad);
    renderizarPaginaCarrito();
    actualizarContadorCarrito();
  }
});

renderizarPaginaCarrito();
actualizarContadorCarrito();