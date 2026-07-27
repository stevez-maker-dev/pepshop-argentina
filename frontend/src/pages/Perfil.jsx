import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import './Auth.css'

function Perfil() {
  const { sesion, guardarSesion } = useAuth()
  const navigate = useNavigate()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [rol, setRol] = useState('')
  const [passwords, setPasswords] = useState({ actual: '', nueva: '', confirmar: '' })
  const [mensajeNombre, setMensajeNombre] = useState(null)
  const [mensajePassword, setMensajePassword] = useState(null)

  useEffect(() => {
    if (!sesion) { navigate('/login'); return }

    async function cargarPerfil() {
      const respuesta = await fetch('/api/perfil', {
        headers: { 'Authorization': `Bearer ${sesion.token}` }
      })
      const datos = await respuesta.json()
      setNombre(datos.nombre)
      setEmail(datos.email)
      setRol(datos.rol === 'admin' ? 'Administrador' : 'Cliente')
    }
    cargarPerfil()
  }, [])

  async function guardarNombre() {
    setMensajeNombre(null)
    const respuesta = await fetch('/api/perfil/nombre', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sesion.token}`
      },
      body: JSON.stringify({ nombre })
    })
    const datos = await respuesta.json()
    if (respuesta.ok) {
      guardarSesion(sesion.token, { ...sesion.usuario, nombre: datos.usuario.nombre })
      setMensajeNombre({ tipo: 'exito', texto: datos.mensaje })
    } else {
      setMensajeNombre({ tipo: 'error', texto: datos.error })
    }
  }

  async function cambiarPassword() {
    setMensajePassword(null)
    if (passwords.nueva !== passwords.confirmar) {
      setMensajePassword({ tipo: 'error', texto: 'Las contraseñas nuevas no coinciden' })
      return
    }
    const respuesta = await fetch('/api/perfil/password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sesion.token}`
      },
      body: JSON.stringify({ passwordActual: passwords.actual, passwordNueva: passwords.nueva })
    })
    const datos = await respuesta.json()
    if (respuesta.ok) {
      setMensajePassword({ tipo: 'exito', texto: datos.mensaje })
      setPasswords({ actual: '', nueva: '', confirmar: '' })
    } else {
      setMensajePassword({ tipo: 'error', texto: datos.error })
    }
  }

  return (
    <>
      <h2>Mi perfil</h2>

      <div className="perfil-seccion">
        <h3>Datos personales</h3>
        {mensajeNombre && (
          <div className={mensajeNombre.tipo === 'exito' ? 'mensaje-exito' : 'mensaje-error'}>
            {mensajeNombre.texto}
          </div>
        )}
        <div className="form-grupo">
          <label>Nombre</label>
          <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} />
        </div>
        <div className="form-grupo">
          <label>Email</label>
          <input type="email" value={email} disabled />
        </div>
        <div className="form-grupo">
          <label>Rol</label>
          <input type="text" value={rol} disabled />
        </div>
        <button className="btn-form" onClick={guardarNombre}>Guardar nombre</button>
      </div>

      <div className="perfil-seccion">
        <h3>Cambiar contraseña</h3>
        {mensajePassword && (
          <div className={mensajePassword.tipo === 'exito' ? 'mensaje-exito' : 'mensaje-error'}>
            {mensajePassword.texto}
          </div>
        )}
        <div className="form-grupo">
          <label>Contraseña actual</label>
          <input type="password" value={passwords.actual} onChange={e => setPasswords({ ...passwords, actual: e.target.value })} placeholder="Tu contraseña actual" />
        </div>
        <div className="form-grupo">
          <label>Nueva contraseña</label>
          <input type="password" value={passwords.nueva} onChange={e => setPasswords({ ...passwords, nueva: e.target.value })} placeholder="Mínimo 6 caracteres" />
        </div>
        <div className="form-grupo">
          <label>Confirmar nueva contraseña</label>
          <input type="password" value={passwords.confirmar} onChange={e => setPasswords({ ...passwords, confirmar: e.target.value })} placeholder="Repetí la nueva contraseña" />
        </div>
        <button className="btn-form" onClick={cambiarPassword}>Cambiar contraseña</button>
      </div>
    </>
  )
}

export default Perfil