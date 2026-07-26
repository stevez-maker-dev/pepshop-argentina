async function cargarResumen() {
  const sesion = obtenerSesion();
  if (!sesion) {
    window.location.href = 'login.html';
    return;
  }

  const carrito = obtenerCarrito();
  if (carrito.length === 0) {
    window.location.href = 'carrito.html';
    return;
  }

  const lista = document.querySelector('#resumen-items');
  const totalEl = document.querySelector('#resumen-total-pago');
  let total = 0;

  try {
    const items = await Promise.all(carrito.map(async item => {
      const respuesta = await fetch(`/api/productos/${item.id}`);
      const producto = await respuesta.json();
      return { producto, cantidad: item.cantidad };
    }));

    lista.innerHTML = items.map(({ producto, cantidad }) => {
      const subtotal = producto.precio * cantidad;
      total += subtotal;
      return `
        <li class="resumen-item">
          <span>${producto.nombre} x${cantidad}</span>
          <span>$${subtotal.toLocaleString('es-AR')}</span>
        </li>
      `;
    }).join('');

    totalEl.textContent = `$${total.toLocaleString('es-AR')}`;

  } catch (error) {
    console.error('Error al cargar resumen:', error);
  }
}

function formatearNumeroTarjeta(valor) {
  return valor.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatearVencimiento(valor) {
  const limpio = valor.replace(/\D/g, '').slice(0, 4);
  return limpio.length >= 3 ? limpio.slice(0, 2) + '/' + limpio.slice(2) : limpio;
}

function validarFormulario() {
  const numero = document.querySelector('#numero-tarjeta').value.replace(/\s/g, '');
  const titular = document.querySelector('#titular-tarjeta').value.trim();
  const vencimiento = document.querySelector('#vencimiento').value;
  const cvv = document.querySelector('#cvv').value;
  const error = document.querySelector('#mensaje-pago-error');

  error.style.display = 'none';

  if (numero.length !== 16) {
    error.textContent = 'El número de tarjeta debe tener 16 dígitos';
    error.style.display = 'block';
    return false;
  }
  if (titular.length < 3) {
    error.textContent = 'Ingresá el nombre del titular';
    error.style.display = 'block';
    return false;
  }
  if (!/^\d{2}\/\d{2}$/.test(vencimiento)) {
    error.textContent = 'El vencimiento debe tener el formato MM/AA';
    error.style.display = 'block';
    return false;
  }
  if (cvv.length !== 3) {
    error.textContent = 'El CVV debe tener 3 dígitos';
    error.style.display = 'block';
    return false;
  }
  return true;
}

async function procesarPago() {
  if (!validarFormulario()) return;

  const sesion = obtenerSesion();
  const carrito = obtenerCarrito();
  const overlay = document.querySelector('#pago-overlay');
  const overlayTexto = document.querySelector('#pago-overlay-texto');

  overlay.style.display = 'flex';
  overlayTexto.textContent = 'Procesando pago...';

  await new Promise(resolve => setTimeout(resolve, 2000));
  overlayTexto.textContent = 'Confirmando orden...';

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
      overlay.style.display = 'none';
      const error = document.querySelector('#mensaje-pago-error');
      error.textContent = datos.error;
      error.style.display = 'block';
      return;
    }

    overlayTexto.textContent = '¡Pago aprobado!';
    await new Promise(resolve => setTimeout(resolve, 1000));

    guardarCarrito([]);
    actualizarContadorCarrito();

    localStorage.setItem('ultima-orden', JSON.stringify(datos.orden));
    window.location.href = `confirmacion.html`;

  } catch (error) {
    overlay.style.display = 'none';
    console.error('Error al procesar pago:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  cargarResumen();
  actualizarContadorCarrito();

  const inputNumero = document.querySelector('#numero-tarjeta');
  const inputTitular = document.querySelector('#titular-tarjeta');
  const inputVencimiento = document.querySelector('#vencimiento');

  inputNumero.addEventListener('input', function() {
    this.value = formatearNumeroTarjeta(this.value);
    document.querySelector('#preview-numero').textContent =
      this.value || '•••• •••• •••• ••••';
  });

  inputTitular.addEventListener('input', function() {
    document.querySelector('#preview-titular').textContent =
      this.value.toUpperCase() || 'NOMBRE APELLIDO';
  });

  inputVencimiento.addEventListener('input', function() {
    this.value = formatearVencimiento(this.value);
    document.querySelector('#preview-vence').textContent =
      this.value || 'MM/AA';
  });

  document.querySelector('#cvv').addEventListener('input', function() {
    this.value = this.value.replace(/\D/g, '').slice(0, 3);
  });

  document.querySelector('#btn-pagar').addEventListener('click', procesarPago);
});