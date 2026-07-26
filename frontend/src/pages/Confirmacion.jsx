import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Confirmacion.css'

function Confirmacion() {
  const [orden, setOrden] = useState(null)

  useEffect(() => {
    const datos = localStorage.getItem('ultima-orden')
    if (datos) {
      setOrden(JSON.parse(datos))
      localStorage.removeItem('ultima-orden')
    }
  }, [])

  if (!orden) {
    return (
      <p className="sin-resultados">
        No encontramos información de tu orden. <Link to="/">Volver al inicio</Link>
      </p>
    )
  }

  return (
    <div className="confirmacion-compra">
      <div className="confirmacion-icono">✓</div>
      <h2>¡Compra realizada con éxito!</h2>
      <p>Tu pago fue procesado correctamente.</p>
      <div className="confirmacion-detalle">
        <p><strong>Número de orden:</strong> #{orden.id.slice(-6).toUpperCase()}</p>
        <p><strong>Total:</strong> ${orden.total.toLocaleString('es-AR')}</p>
        <p><strong>Estado:</strong> {orden.estado}</p>
      </div>
      <div className="confirmacion-acciones">
        <Link to="/mis-ordenes" className="btn-form">Ver mis órdenes</Link>
        <Link to="/" className="btn-form btn-secundario">Seguir comprando</Link>
      </div>
    </div>
  )
}

export default Confirmacion