import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCarrito } from '../context/CarritoContext.jsx'
import './Pago.css'

function Pago() {
  const { sesion } = useAuth()
  const { carrito, vaciarCarrito } = useCarrito()
  const navigate = useNavigate()

  const [form, setForm] = useState({ numero: '', titular: '', vencimiento: '', cvv: '' })
  const [error, setError] = useState(null)
  const [procesando, setProcesando] = useState(false)
  const [textoOverlay, setTextoOverlay] = useState('Procesando pago...')
  const [productos, setProductos] = useState([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (!sesion) { navigate('/login'); return }
    if (carrito.length === 0) { navigate('/carrito'); return }

    async function cargarResumen() {
      const items = await Promise.all(carrito.map(async item => {
        const r = await fetch(`/api/productos/${item.id}`)
        const p = await r.json()
        return { producto: p, cantidad: item.cantidad }
      }))
      setProductos(items)
      setTotal(items.reduce((acc, { producto, cantidad }) => acc + producto.precio * cantidad, 0))
    }
    cargarResumen()
  }, [])

  function formatNumero(val) {
    return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  }

  function formatVencimiento(val) {
    const limpio = val.replace(/\D/g, '').slice(0, 4)
    return limpio.length >= 3 ? limpio.slice(0, 2) + '/' + limpio.slice(2) : limpio
  }

  function handleChange(e) {
    const { name, value } = e.target
    let formateado = value
    if (name === 'numero') formateado = formatNumero(value)
    if (name === 'vencimiento') formateado = formatVencimiento(value)
    if (name === 'cvv') formateado = value.replace(/\D/g, '').slice(0, 3)
    setForm({ ...form, [name]: formateado })
  }

  function validar() {
    if (form.numero.replace(/\s/g, '').length !== 16) return 'El número de tarjeta debe tener 16 dígitos'
    if (form.titular.trim().length < 3) return 'Ingresá el nombre del titular'
    if (!/^\d{2}\/\d{2}$/.test(form.vencimiento)) return 'El vencimiento debe tener el formato MM/AA'
    if (form.cvv.length !== 3) return 'El CVV debe tener 3 dígitos'
    return null
  }

  async function handlePagar() {
    const errorValidacion = validar()
    if (errorValidacion) { setError(errorValidacion); return }

    setError(null)
    setProcesando(true)
    setTextoOverlay('Procesando pago...')

    await new Promise(r => setTimeout(r, 2000))
    setTextoOverlay('Confirmando orden...')

    try {
      const respuesta = await fetch('/api/ordenes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sesion.token}`
        },
        body: JSON.stringify({ items: carrito })
      })

      const datos = await respuesta.json()

      if (!respuesta.ok) {
        setProcesando(false)
        setError(datos.error)
        return
      }

      setTextoOverlay('¡Pago aprobado!')
      await new Promise(r => setTimeout(r, 1000))

      vaciarCarrito()
      localStorage.setItem('ultima-orden', JSON.stringify(datos.orden))
      navigate('/confirmacion')

    } catch (err) {
      setProcesando(false)
      setError('Error de conexión. Intentá de nuevo.')
    }
  }

  return (
    <>
      <div className="pago-contenedor">
        <div className="pago-formulario">
          <a onClick={() => navigate(-1)} className="volver">← Volver al carrito</a>
          <h2>Datos de pago</h2>

          {error && <div className="mensaje-error">{error}</div>}

          <div className="tarjeta-preview">
            <div className="tarjeta-chip"></div>
            <div className="tarjeta-numero">{form.numero || '•••• •••• •••• ••••'}</div>
            <div className="tarjeta-inferior">
              <div>
                <div className="tarjeta-label">Titular</div>
                <div className="tarjeta-titular">{form.titular.toUpperCase() || 'NOMBRE APELLIDO'}</div>
              </div>
              <div>
                <div className="tarjeta-label">Vence</div>
                <div className="tarjeta-vence">{form.vencimiento || 'MM/AA'}</div>
              </div>
            </div>
          </div>

          <div className="form-grupo">
            <label htmlFor="numero">Número de tarjeta</label>
            <input type="text" id="numero" name="numero" value={form.numero} onChange={handleChange} placeholder="1234 5678 9012 3456" maxLength="19" />
          </div>
          <div className="form-grupo">
            <label htmlFor="titular">Nombre del titular</label>
            <input type="text" id="titular" name="titular" value={form.titular} onChange={handleChange} placeholder="Como figura en la tarjeta" />
          </div>
          <div className="pago-fila">
            <div className="form-grupo">
              <label htmlFor="vencimiento">Vencimiento</label>
              <input type="text" id="vencimiento" name="vencimiento" value={form.vencimiento} onChange={handleChange} placeholder="MM/AA" maxLength="5" />
            </div>
            <div className="form-grupo">
              <label htmlFor="cvv">CVV</label>
              <input type="text" id="cvv" name="cvv" value={form.cvv} onChange={handleChange} placeholder="123" maxLength="3" />
            </div>
          </div>
          <button className="btn-form" onClick={handlePagar} disabled={procesando}>
            Confirmar pago
          </button>
        </div>

        <aside className="pago-resumen">
          <h3>Resumen del pedido</h3>
          <ul className="resumen-items">
            {productos.map(({ producto, cantidad }) => (
              <li key={producto._id} className="resumen-item">
                <span>{producto.nombre} x{cantidad}</span>
                <span>${(producto.precio * cantidad).toLocaleString('es-AR')}</span>
              </li>
            ))}
          </ul>
          <div className="resumen-linea resumen-total">
            <span>Total</span>
            <span>${total.toLocaleString('es-AR')}</span>
          </div>
        </aside>
      </div>

      {procesando && (
        <div className="pago-overlay">
          <div className="pago-procesando">
            <div className="spinner"></div>
            <p>{textoOverlay}</p>
          </div>
        </div>
      )}
    </>
  )
}

export default Pago