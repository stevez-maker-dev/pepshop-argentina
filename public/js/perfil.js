async function cargarPerfil() {
  const sesion = obtenerSesion();
  if (!sesion) {
    window.location.href = 'login.html';
    return;
  }

  try {
    const respuesta = await fetch('/api/perfil', {
      headers: { 'Authorization': `Bearer ${sesion.token}` }
    });

    const usuario = await respuesta.json();

    document.querySelector('#perfil-nombre').value = usuario.nombre;
    document.querySelector('#perfil-email').value = usuario.email;
    document.querySelector('#perfil-rol').value = usuario.rol === 'admin' ? 'Administrador' : 'Cliente';

  } catch (error) {
    console.error('Error al cargar perfil:', error);
  }
}

async function guardarNombre() {
  const sesion = obtenerSesion();
  const nombre = document.querySelector('#perfil-nombre').value.trim();
  const mensaje = document.querySelector('#mensaje-nombre');

  mensaje.style.display = 'none';

  try {
    const respuesta = await fetch('/api/perfil/nombre', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sesion.token}`
      },
      body: JSON.stringify({ nombre })
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      mensaje.textContent = datos.error;
      mensaje.className = 'mensaje-error';
      mensaje.style.display = 'block';
      return;
    }

    const usuarioActualizado = { ...sesion.usuario, nombre: datos.usuario.nombre };
    guardarSesion(sesion.token, usuarioActualizado);
    actualizarMenuUsuario();

    mensaje.textContent = datos.mensaje;
    mensaje.className = 'mensaje-exito';
    mensaje.style.display = 'block';

  } catch (error) {
    console.error('Error al guardar nombre:', error);
  }
}

async function cambiarPassword() {
  const sesion = obtenerSesion();
  const passwordActual = document.querySelector('#password-actual').value;
  const passwordNueva = document.querySelector('#password-nueva').value;
  const passwordConfirmar = document.querySelector('#password-confirmar').value;
  const mensajeExito = document.querySelector('#mensaje-password');
  const mensajeError = document.querySelector('#error-password');

  mensajeExito.style.display = 'none';
  mensajeError.style.display = 'none';

  if (passwordNueva !== passwordConfirmar) {
    mensajeError.textContent = 'Las contraseñas nuevas no coinciden';
    mensajeError.style.display = 'block';
    return;
  }

  try {
    const respuesta = await fetch('/api/perfil/password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sesion.token}`
      },
      body: JSON.stringify({ passwordActual, passwordNueva })
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      mensajeError.textContent = datos.error;
      mensajeError.style.display = 'block';
      return;
    }

    mensajeExito.textContent = datos.mensaje;
    mensajeExito.style.display = 'block';

    document.querySelector('#password-actual').value = '';
    document.querySelector('#password-nueva').value = '';
    document.querySelector('#password-confirmar').value = '';

  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  cargarPerfil();
  actualizarContadorCarrito();

  document.querySelector('#btn-guardar-nombre').addEventListener('click', guardarNombre);
  document.querySelector('#btn-cambiar-password').addEventListener('click', cambiarPassword);
});