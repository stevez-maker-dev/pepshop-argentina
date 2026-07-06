function obtenerCarrito() {
  const datosGuardados = localStorage.getItem('carrito');
  return datosGuardados ? JSON.parse(datosGuardados) : [];
}

function guardarCarrito(carrito) {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function agregarAlCarrito(idProducto, cantidad = 1) {
  const carrito = obtenerCarrito();
  const itemExistente = carrito.find(item => item.id === idProducto);

  if (itemExistente) {
    itemExistente.cantidad += cantidad;
  } else {
    carrito.push({ id: idProducto, cantidad: cantidad });
  }

  guardarCarrito(carrito);
  actualizarContadorCarrito();
}

function contarItemsCarrito() {
  const carrito = obtenerCarrito();
  return carrito.reduce((total, item) => total + item.cantidad, 0);
}

function actualizarContadorCarrito() {
  const contador = document.querySelector('#contador-carrito');
  if (contador) {
    contador.textContent = contarItemsCarrito();
  }
}

actualizarContadorCarrito();