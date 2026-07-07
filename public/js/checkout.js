async function finalizarCompra() {
  const sesion = obtenerSesion();

  if (!sesion) {
    window.location.href = 'login.html';
    return;
  }

  const carrito = obtenerCarrito();

  if (carrito.length === 0) {
    alert('Tu carrito está vacío');
    return;
  }

  const btnFinalizar = document.querySelector('.btn-finalizar');
  btnFinalizar.textContent = 'Procesando...';
  btnFinalizar.disabled = true;

  try {
    const respuesta = await fetch('/api/ordenes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sesion.token}`
      },
      body: JSON.stringify({ items: carrito })
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      alert(datos.error);
      btnFinalizar.textContent = 'Finalizar compra';
      btnFinalizar.disabled = false;
      return;
    }

    guardarCarrito([]);
    actualizarContadorCarrito();

    mostrarConfirmacion(datos);

  } catch (error) {
    alert('Error de conexión. Intentá de nuevo.');
    btnFinalizar.textContent = 'Finalizar compra';
    btnFinalizar.disabled = false;
  }
}

function mostrarConfirmacion(datos) {
  const contenedor = document.querySelector('.carrito-contenedor');

  contenedor.innerHTML = `
    <div class="confirmacion-compra">
      <div class="confirmacion-icono">✓</div>
      <h2>¡Compra realizada con éxito!</h2>
      <p>Tu orden fue procesada correctamente.</p>
      <div class="confirmacion-detalle">
        <p><strong>Número de orden:</strong> ${datos.orden.id}</p>
        <p><strong>Total:</strong> $${datos.orden.total.toLocaleString('es-AR')}</p>
        <p><strong>Estado:</strong> ${datos.orden.estado}</p>
      </div>
      <a href="index.html" class="btn-form" style="display:inline-block; text-decoration:none; margin-top:1rem;">
        Seguir comprando
      </a>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  const btnFinalizar = document.querySelector('.btn-finalizar');
  if (btnFinalizar) {
    btnFinalizar.addEventListener('click', finalizarCompra);
  }
});