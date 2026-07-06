function crearTarjetaProducto(producto) {
  return `
    <article class="producto" data-id="${producto.id}">
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <a href="producto.html?id=${producto.id}" class="link-producto">
        <h3>${producto.nombre}</h3>
      </a>
      <p class="categoria">${producto.especie} · ${producto.categoria}</p>
      <p class="precio">$${producto.precio.toLocaleString('es-AR')}</p>
      <button class="btn-agregar-carrito" data-id="${producto.id}">Agregar al carrito</button>
    </article>
  `;
}

function obtenerEspecieDesdeURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('especie');
}

function renderizarCatalogo() {
  const contenedor = document.querySelector('.grid-productos');
  const titulo = document.querySelector('#titulo-catalogo');
  const especie = obtenerEspecieDesdeURL();

  const productosFiltrados = especie
    ? productos.filter(p => p.especie === especie)
    : productos;

  if (titulo) {
    titulo.textContent = especie
      ? `Catálogo de productos para ${especie === 'Perro' ? 'perros' : 'gatos'}`
      : 'Catálogo de productos';
  }

  if (productosFiltrados.length === 0) {
    contenedor.innerHTML = '<p class="sin-resultados">No encontramos productos en esta categoría.</p>';
    return;
  }

  contenedor.innerHTML = productosFiltrados.map(crearTarjetaProducto).join('');
}

renderizarCatalogo();

document.querySelector('.grid-productos').addEventListener('click', function(evento) {
  if (evento.target.classList.contains('btn-agregar-carrito')) {
    const id = Number(evento.target.dataset.id);
    agregarAlCarrito(id);
  }
});