async function renderizarDetalleProducto() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const contenedor = document.querySelector('#detalle-producto');

  if (!id) {
    contenedor.innerHTML = '<p class="no-encontrado">ID de producto no válido. <a href="index.html">Volver al catálogo</a></p>';
    return;
  }

  try {
    const respuesta = await fetch(`/api/productos/${id}`);

    if (!respuesta.ok) {
      contenedor.innerHTML = '<p class="no-encontrado">No encontramos ese producto. <a href="index.html">Volver al catálogo</a></p>';
      return;
    }

    const producto = await respuesta.json();
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
        <button class="btn-agregar" data-id="${producto._id}">Agregar al carrito</button>
      </div>
    `;

    document.querySelector('.btn-agregar').addEventListener('click', function() {
      const cantidad = Math.max(1, Number(document.querySelector('#cantidad').value) || 1);
      agregarAlCarrito(producto._id, cantidad);
    });

  } catch (error) {
    contenedor.innerHTML = '<p class="no-encontrado">Error al cargar el producto. <a href="index.html">Volver al catálogo</a></p>';
    console.error('Error al cargar producto:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderizarDetalleProducto();
  actualizarContadorCarrito();
});