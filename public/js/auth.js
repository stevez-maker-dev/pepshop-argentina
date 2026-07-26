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

  const itemsAteriores = nav.querySelectorAll('.nav-sesion');
  itemsAteriores.forEach(item => item.remove());

  if (sesion) {
    if (sesion.usuario.rol === 'admin'){
      const itemAdmin = document.createElement('li');
      itemAdmin.className = 'nav-sesion';
      itemAdmin.innerHTML = `<a href="admin.html" class="nav-admin">Panel admin</a>`
      nav.appendChild(itemAdmin);
    }

    const itemOrdenes = document.createElement('li');
    itemOrdenes.className = 'nav-sesion';
    itemOrdenes.innerHTML = `<a href="mis-ordenes.html">Mis ordenes</a>`;
    nav.appendChild(itemOrdenes);

    const itemPerfil = document.createElement('li');
    itemPerfil.className = 'nav-sesion';
    itemPerfil.innerHTML = `<a href="perfil.html">Mi perfil</a>`;
    nav.appendChild(itemPerfil);

    const itemUsuario = document.createElement('li');
    itemUsuario.className = 'nav-sesion';
    itemUsuario.innerHTML = `
      <span class="nav-usuario">Hola, ${sesion.usuario.nombre.split(' ')[0]}</span>
      <button class="btn-cerrar-sesion" onclick="cerrarSesion()">Salir</button>
    `;
    nav.appendChild(itemUsuario);

  } else {
    const itemRegistro = document.createElement('li');
    itemRegistro.className = 'nav-sesion';
    itemRegistro.innerHTML = `<a href="registro.html">Registrarse</a>`;
    nav.appendChild(itemRegistro);

    const itemLogin = document.createElement('li');
    itemLogin.className = 'nav-sesion';
    itemLogin.innerHTML = `<a href="login.html">Ingresar</a>`;
    nav.appendChild(itemLogin);
  }
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