import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext.jsx'
import './Catalogo.css'

function TarjetaProducto({ producto }) {
  const { agregarAlCarrito } = useCarrito()

  return (
    <article className="producto">
      <img src={producto.imagen} alt={producto.nombre} />
      <Link to={`/producto/${producto._id}`} className="link-producto">
        <h3>{producto.nombre}</h3>
      </Link>
      <p className="categoria">{producto.especie} · {producto.categoria}</p>
      <p className="precio">${producto.precio.toLocaleString('es-AR')}</p>
      <button onClick={() => agregarAlCarrito(producto._id)}>
        Agregar al carrito
      </button>
    </article>
  )
}

function Catalogo() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [searchParams] = useSearchParams()
  const especie = searchParams.get('especie')

  useEffect(() => {
    async function cargarProductos() {
      setCargando(true)
      setError(null)
      try {
        const url = especie ? `/api/productos?especie=${especie}` : '/api/productos'
        const respuesta = await fetch(url)
        const datos = await respuesta.json()
        setProductos(datos)
      } catch (err) {
        setError('Error al cargar los productos')
      } finally {
        setCargando(false)
      }
    }
    cargarProductos()
  }, [especie])

  const titulo = especie
    ? `Productos para ${especie === 'Perro' ? 'perros' : 'gatos'}`
    : 'Catálogo de productos'

  if (cargando) return <p>Cargando productos...</p>
  if (error) return <p className="sin-resultados">{error}</p>

  return (
    <>
      <h2>{titulo}</h2>
      {productos.length === 0
        ? <p className="sin-resultados">No encontramos productos en esta categoría.</p>
        : <section className="grid-productos">
            {productos.map(p => <TarjetaProducto key={p._id} producto={p} />)}
          </section>
      }
    </>
  )
}

export default Catalogo