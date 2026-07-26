async function cargarMisOrdenes() {
  const sesion = obtenerSesion();
  const contenedor = document.querySelector('#contenedor-ordenes');

  if (!sesion) {
    window.location.href = 'login.html';
    return;
  }

  try {
    const respuesta = await fetch('/api/ordenes/mis-ordenes', {
      headers: { 'Authorization': `Bearer ${sesion.token}` }
    });

    const ordenes = await respuesta.json();

    if (ordenes.length === 0) {
      contenedor.innerHTML = `
        <div class="ordenes-vacio">
          <p>Todavía no realizaste ninguna compra.</p>
          <a href="index.html" class="btn-form" style="display:inline-block;text-decoration:none;margin-top:1rem;">
            Ver productos
          </a>
        </div>
      `;
      return;
    }

    contenedor.innerHTML = ordenes.map(orden => `
      <div class="orden-card">
        <div class="orden-encabezado">
          <div>
            <span class="orden-id">Orden #${orden._id.slice(-6).toUpperCase()}</span>
            <span class="badge-estado badge-${orden.estado}">${orden.estado}</span>
          </div>
          <span class="orden-fecha">${new Date(orden.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
        </div>

        <ul class="orden-items">
          ${orden.items.map(item => `
            <li class="orden-item">
              <span class="orden-item-nombre">${item.nombre}</span>
              <span class="orden-item-detalle">${item.cantidad} x $${item.precio.toLocaleString('es-AR')}</span>
              <span class="orden-item-subtotal">$${(item.precio * item.cantidad).toLocaleString('es-AR')}</span>
            </li>
          `).join('')}
        </ul>

        <div class="orden-total">
          <span>Total</span>
          <span>$${orden.total.toLocaleString('es-AR')}</span>
        </div>
      </div>
    `).join('');

  } catch (error) {
    contenedor.innerHTML = '<p class="sin-resultados">Error al cargar las órdenes.</p>';
    console.error('Error:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  cargarMisOrdenes();
  actualizarContadorCarrito();
});