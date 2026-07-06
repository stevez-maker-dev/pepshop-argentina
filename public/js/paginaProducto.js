function obtenerIdDesdeURL() {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get('id'));
}

function renderizarDetalleProducto() {
  const id = obtenerIdDesdeURL();
  const producto = productos.find(p => p.id === id);
  const contenedor = document.querySelector('#detalle-producto');

  if (!producto) {
    contenedor.innerHTML = `
      <p class="no-encontrado">
        No encontramos ese producto. <a href="index.html">Volver al catálogo</a>
      </p>
    `;
    return;
  }

  document.title = `${producto.nombre} - PepShop Argentina`;

  contenedor.innerHTML = `
    <img src="${producto.imagen}" alt="${producto.nombre}">
    <div class="detalle-info">
      <p class="categoria">${producto.especie} · ${producto.categoria}</p>
      <h2>${producto.nombre}</h2>
      <p class="precio">$${producto.precio.toLocaleString('es-AR')}</p>
      <p class="descripcion">${producto.descripcion}</p>
      <div class="cantidad-selector">
        <label for="cantidad">Cantidad:</label>
        <input type="number" id="cantidad" name="cantidad" value="1" min="1">
      </div>
      <button class="btn-agregar" data-id="${producto.id}">Agregar al carrito</button>
    </div>
  `;

  document.querySelector('.btn-agregar').addEventListener('click', function() {
    const inputCantidad = document.querySelector('#cantidad');
    const cantidad = Math.max(1, Number(inputCantidad.value) || 1);
    agregarAlCarrito(producto.id, cantidad);
  });
}

renderizarDetalleProducto();
actualizarContadorCarrito();