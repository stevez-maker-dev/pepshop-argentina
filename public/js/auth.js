function guardarSesion(token, usuario) {
  localStorage.setItem('token', token);
  localStorage.setItem('usuario', JSON.stringify(usuario));
}

function obtenerSesion() {
  const token = localStorage.getItem('token');
  const usuario = localStorage.getItem('usuario');
  return token ? { token, usuario: JSON.parse(usuario) } : null;
}

function cerrarSesion() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  window.location.href = 'index.html';
}

function actualizarMenuUsuario() {
  const sesion = obtenerSesion();
  const nav = document.querySelector('nav ul');
  if (!nav) return;

  const itemSesion = document.createElement('li');

  if (sesion) {
    itemSesion.innerHTML = `
      <span class="nav-usuario">Hola, ${sesion.usuario.nombre.split(' ')[0]}</span>
      <button class="btn-cerrar-sesion" onclick="cerrarSesion()">Salir</button>
    `;
  } else {
    itemSesion.innerHTML = `<a href="login.html">Ingresar</a>`;
  }

  nav.appendChild(itemSesion);
}

async function manejarRegistro() {
  const nombre = document.querySelector('#nombre').value.trim();
  const email = document.querySelector('#email').value.trim();
  const password = document.querySelector('#password').value;
  const mensajeError = document.querySelector('#mensaje-error');

  mensajeError.style.display = 'none';

  if (!nombre || !email || !password) {
    mensajeError.textContent = 'Completá todos los campos';
    mensajeError.style.display = 'block';
    return;
  }

  try {
    const respuesta = await fetch('/api/auth/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password })
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      mensajeError.textContent = datos.error;
      mensajeError.style.display = 'block';
      return;
    }

    guardarSesion(datos.token, datos.usuario);
    window.location.href = 'index.html';

  } catch (error) {
    mensajeError.textContent = 'Error de conexión. Intentá de nuevo.';
    mensajeError.style.display = 'block';
  }
}

async function manejarLogin() {
  const email = document.querySelector('#email').value.trim();
  const password = document.querySelector('#password').value;
  const mensajeError = document.querySelector('#mensaje-error');

  mensajeError.style.display = 'none';

  if (!email || !password) {
    mensajeError.textContent = 'Completá todos los campos';
    mensajeError.style.display = 'block';
    return;
  }

  try {
    const respuesta = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      mensajeError.textContent = datos.error;
      mensajeError.style.display = 'block';
      return;
    }

    guardarSesion(datos.token, datos.usuario);
    window.location.href = 'index.html';

  } catch (error) {
    mensajeError.textContent = 'Error de conexión. Intentá de nuevo.';
    mensajeError.style.display = 'block';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  actualizarMenuUsuario();

  const btnRegistro = document.querySelector('#btn-registro');
  const btnLogin = document.querySelector('#btn-login');

  if (btnRegistro) btnRegistro.addEventListener('click', manejarRegistro);
  if (btnLogin) btnLogin.addEventListener('click', manejarLogin);
});