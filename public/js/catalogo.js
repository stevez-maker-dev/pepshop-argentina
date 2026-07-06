function crearTarjetaProducto(producto) {
  return `
    <article class="producto" data-id="${producto._id}">
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <a href="producto.html?id=${producto._id}" class="link-producto">
        <h3>${producto.nombre}</h3>
      </a>
      <p class="categoria">${producto.especie} · ${producto.categoria}</p>
      <p class="precio">$${producto.precio.toLocaleString('es-AR')}</p>
      <button class="btn-agregar-carrito" data-id="${producto._id}">Agregar al carrito</button>
    </article>
  `;
}

async function renderizarCatalogo() {
  const contenedor = document.querySelector('.grid-productos');
  const titulo = document.querySelector('#titulo-catalogo');

  const params = new URLSearchParams(window.location.search);
  const especie = params.get('especie');

  try {
    const url = especie ? `/api/productos?especie=${especie}` : '/api/productos';
    const respuesta = await fetch(url);
    const productos = await respuesta.json();

    if (titulo) {
      titulo.textContent = especie
        ? `Catálogo de productos para ${especie === 'Perro' ? 'perros' : 'gatos'}`
        : 'Catálogo de productos';
    }

    if (productos.length === 0) {
      contenedor.innerHTML = '<p class="sin-resultados">No encontramos productos en esta categoría.</p>';
      return;
    }

    contenedor.innerHTML = productos.map(crearTarjetaProducto).join('');

  } catch (error) {
    contenedor.innerHTML = '<p class="sin-resultados">Error al cargar los productos. Intentá de nuevo.</p>';
    console.error('Error al cargar catálogo:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderizarCatalogo();

  document.querySelector('.grid-productos').addEventListener('click', function(evento) {
    if (evento.target.classList.contains('btn-agregar-carrito')) {
      const id = evento.target.dataset.id;
      agregarAlCarrito(id);
    }
  });
});