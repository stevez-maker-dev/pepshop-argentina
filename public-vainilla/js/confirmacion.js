document.addEventListener('DOMContentLoaded', () => {
  actualizarContadorCarrito();

  const orden = JSON.parse(localStorage.getItem('ultima-orden'));
  const contenedor = document.querySelector('#contenido-confirmacion');

  if (!orden) {
    contenedor.innerHTML = `
      <p class="no-encontrado">No encontramos información de tu orden.
      <a href="index.html">Volver al inicio</a></p>
    `;
    return;
  }

  contenedor.innerHTML = `
    <div class="confirmacion-icono">✓</div>
    <h2>¡Compra realizada con éxito!</h2>
    <p>Tu pago fue procesado correctamente.</p>
    <div class="confirmacion-detalle">
      <p><strong>Número de orden:</strong> #${orden.id.slice(-6).toUpperCase()}</p>
      <p><strong>Total:</strong> $${orden.total.toLocaleString('es-AR')}</p>
      <p><strong>Estado:</strong> ${orden.estado}</p>
    </div>
    <div style="display:flex; gap:1rem; justify-content:center; flex-wrap:wrap; margin-top:1.5rem;">
      <a href="mis-ordenes.html" class="btn-form" style="display:inline-block;text-decoration:none;">
        Ver mis órdenes
      </a>
      <a href="index.html" class="btn-form" style="display:inline-block;text-decoration:none;background-color:var(--color-text-muted);">
        Seguir comprando
      </a>
    </div>
  `;

  localStorage.removeItem('ultima-orden');
});