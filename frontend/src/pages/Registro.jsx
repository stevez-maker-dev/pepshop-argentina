import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import './Auth.css'

function Registro() {
  const { guardarSesion } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ nombre: '', email: '', password: '' })
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit() {
    setError(null)

    if (!form.nombre || !form.email || !form.password) {
      setError('Completá todos los campos')
      return
    }

    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setCargando(true)
    try {
      const respuesta = await fetch('/api/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const datos = await respuesta.json()

      if (!respuesta.ok) {
        setError(datos.error)
        return
      }

      guardarSesion(datos.token, datos.usuario)
      navigate('/')
    } catch (err) {
      setError('Error de conexión. Intentá de nuevo.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="form-contenedor">
      <h2>Crear cuenta</h2>
      <p className="form-subtitulo">
        ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
      </p>

      {error && <div className="mensaje-error">{error}</div>}

      <div className="form-grupo">
        <label htmlFor="nombre">Nombre completo</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Tu nombre"
        />
      </div>
      <div className="form-grupo">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="tu@email.com"
        />
      </div>
      <div className="form-grupo">
        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          id="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Mínimo 6 caracteres"
        />
      </div>
      <button className="btn-form" onClick={handleSubmit} disabled={cargando}>
        {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
      </button>
    </div>
  )
}

export default Registro