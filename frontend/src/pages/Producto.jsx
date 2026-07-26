import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext.jsx'
import './Producto.css'

function BadgeStock({ stock }) {
  if (stock <= 0) return <span className="badge-stock stock-agotado">Sin stock</span>
  if (stock <= 10) return <span className="badge-stock stock-bajo">Últimas {stock} unidades</span>
  return <span className="badge-stock stock-ok">Disponible</span>
}

function Producto() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { agregarAlCarrito } = useCarrito()
  const [producto, setProducto] = useState(null)
  const [cantidad, setCantidad] = useState(1)
  const [cargando, setCargando] = useState(true)
  const [agregado, setAgregado] = useState(false)

  useEffect(() => {
    async function cargarProducto() {
      try {
        const respuesta = await fetch(`/api/productos/${id}`)
        if (!respuesta.ok) {
          navigate('/')
          return
        }
        const datos = await respuesta.json()
        setProducto(datos)
      } catch (error) {
        navigate('/')
      } finally {
        setCargando(false)
      }
    }
    cargarProducto()
  }, [id])

  function handleAgregar() {
    agregarAlCarrito(producto._id, cantidad)
    setAgregado(true)
    setTimeout(() => setAgregado(false), 2000)
  }

  if (cargando) return <p>Cargando producto...</p>
  if (!producto) return null

  const sinStock = producto.stock <= 0

  return (
    <>
      <a onClick={() => navigate(-1)} className="volver">← Volver</a>
      <section className="detalle-producto">
        <img src={producto.imagen} alt={producto.nombre} />
        <div className="detalle-info">
          <p className="categoria">{producto.especie} · {producto.categoria}</p>
          <h2>{producto.nombre}</h2>
          <p className="precio">${producto.precio.toLocaleString('es-AR')}</p>
          <BadgeStock stock={producto.stock} />
          <p className="descripcion">{producto.descripcion}</p>
          <div className="cantidad-selector">
            <label htmlFor="cantidad">Cantidad:</label>
            <input
              type="number"
              id="cantidad"
              value={cantidad}
              min="1"
              max={producto.stock}
              disabled={sinStock}
              onChange={e => setCantidad(Math.max(1, Number(e.target.value) || 1))}
            />
          </div>
          <button
            className="btn-agregar"
            onClick={handleAgregar}
            disabled={sinStock}
            style={sinStock ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          >
            {sinStock ? 'Sin stock' : agregado ? '¡Agregado! ✓' : 'Agregar al carrito'}
          </button>
        </div>
      </section>
    </>
  )
}

export default Producto