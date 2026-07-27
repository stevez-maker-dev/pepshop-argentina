import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import './MisOrdenes.css'

function MisOrdenes() {
  const { sesion } = useAuth()
  const navigate = useNavigate()
  const [ordenes, setOrdenes] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (!sesion) { navigate('/login'); return }

    async function cargarOrdenes() {
      try {
        const respuesta = await fetch('/api/ordenes/mis-ordenes', {
          headers: { 'Authorization': `Bearer ${sesion.token}` }
        })
        const datos = await respuesta.json()
        setOrdenes(datos)
      } catch (error) {
        console.error('Error al cargar órdenes:', error)
      } finally {
        setCargando(false)
      }
    }
    cargarOrdenes()
  }, [])

  if (cargando) return <p>Cargando órdenes...</p>

  if (ordenes.length === 0) {
    return (
      <div className="ordenes-vacio">
        <p>Todavía no realizaste ninguna compra.</p>
        <Link to="/" className="btn-form">Ver productos</Link>
      </div>
    )
  }

  return (
    <>
      <h2>Mis órdenes</h2>
      {ordenes.map(orden => (
        <div key={orden._id} className="orden-card">
          <div className="orden-encabezado">
            <div>
              <span className="orden-id">Orden #{orden._id.slice(-6).toUpperCase()}</span>
              <span className={`badge-estado badge-${orden.estado}`}>{orden.estado}</span>
            </div>
            <span className="orden-fecha">
              {new Date(orden.createdAt).toLocaleDateString('es-AR', {
                day: '2-digit', month: 'long', year: 'numeric'
              })}
            </span>
          </div>

          <ul className="orden-items">
            {orden.items.map((item, i) => (
              <li key={i} className="orden-item">
                <span className="orden-item-nombre">{item.nombre}</span>
                <span className="orden-item-detalle">{item.cantidad} x ${item.precio.toLocaleString('es-AR')}</span>
                <span className="orden-item-subtotal">${(item.precio * item.cantidad).toLocaleString('es-AR')}</span>
              </li>
            ))}
          </ul>

          <div className="orden-total">
            <span>Total</span>
            <span>${orden.total.toLocaleString('es-AR')}</span>
          </div>
        </div>
      ))}
    </>
  )
}

export default MisOrdenes