import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import './Auth.css'

function Login() {
  const { guardarSesion } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit() {
    setError(null)

    if (!form.email || !form.password) {
      setError('Completá todos los campos')
      return
    }

    setCargando(true)
    try {
      const respuesta = await fetch('/api/auth/login', {
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
      <h2>Iniciar sesión</h2>
      <p className="form-subtitulo">
        ¿No tenés cuenta? <Link to="/registro">Registrate</Link>
      </p>

      {error && <div className="mensaje-error">{error}</div>}

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
          placeholder="Tu contraseña"
        />
      </div>
      <button className="btn-form" onClick={handleSubmit} disabled={cargando}>
        {cargando ? 'Ingresando...' : 'Iniciar sesión'}
      </button>
    </div>
  )
}

export default Login