import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import './Carrito.css'

function ItemCarrito({ item, onEliminar, onCambiarCantidad }) {
  const [producto, setProducto] = useState(null)

  useEffect(() => {
    fetch(`/api/productos/${item.id}`)
      .then(r => r.json())
      .then(setProducto)
  }, [item.id])

  if (!producto) return null

  return (
    <li className="carrito-item">
      <img src={producto.imagen} alt={producto.nombre} />
      <div className="carrito-item-info">
        <h3>{producto.nombre}</h3>
        <p className="categoria">{producto.especie} · {producto.categoria}</p>
        <p className="precio-unitario">${producto.precio.toLocaleString('es-AR')} c/u</p>
      </div>
      <div className="cantidad-selector">
        <label htmlFor={`cant-${item.id}`}>Cantidad:</label>
        <input
          type="number"
          id={`cant-${item.id}`}
          value={item.cantidad}
          min="1"
          onChange={e => onCambiarCantidad(item.id, Math.max(1, Number(e.target.value) || 1))}
        />
      </div>
      <p className="subtotal">${(producto.precio * item.cantidad).toLocaleString('es-AR')}</p>
      <button className="btn-eliminar" onClick={() => onEliminar(item.id)} aria-label="Eliminar">×</button>
    </li>
  )
}

function Carrito() {
  const { carrito, eliminarDelCarrito, cambiarCantidad, totalItems } = useCarrito()
  const { sesion } = useAuth()
  const navigate = useNavigate()

  const [productos, setProductos] = useState({})

  useEffect(() => {
    carrito.forEach(item => {
      if (!productos[item.id]) {
        fetch(`/api/productos/${item.id}`)
          .then(r => r.json())
          .then(p => setProductos(prev => ({ ...prev, [p._id]: p })))
      }
    })
  }, [carrito])

  const total = carrito.reduce((acc, item) => {
    const p = productos[item.id]
    return acc + (p ? p.precio * item.cantidad : 0)
  }, 0)

  function handleFinalizar() {
    if (!sesion) {
      navigate('/login')
      return
    }
    navigate('/pago')
  }

  if (carrito.length === 0) {
    return (
      <div className="carrito-vacio">
        <p>Tu carrito está vacío.</p>
        <Link to="/" className="btn-form">Ver productos</Link>
      </div>
    )
  }

  return (
    <>
      <h2>Tu carrito</h2>
      <div className="carrito-contenedor">
        <ul className="lista-carrito">
          {carrito.map(item => (
            <ItemCarrito
              key={item.id}
              item={item}
              onEliminar={eliminarDelCarrito}
              onCambiarCantidad={cambiarCantidad}
            />
          ))}
        </ul>

        <aside className="resumen-compra">
          <h3>Resumen</h3>
          <div className="resumen-linea">
            <span>Subtotal</span>
            <span>${total.toLocaleString('es-AR')}</span>
          </div>
          <div className="resumen-linea">
            <span>Envío</span>
            <span>A calcular</span>
          </div>
          <div className="resumen-linea resumen-total">
            <span>Total</span>
            <span>${total.toLocaleString('es-AR')}</span>
          </div>
          <button className="btn-finalizar" onClick={handleFinalizar}>
            Finalizar compra
          </button>
        </aside>
      </div>
    </>
  )
}

export default Carrito