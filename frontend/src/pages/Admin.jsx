import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import './Admin.css'

const CATEGORIAS = ['Alimento', 'Juguete', 'Accesorio', 'Higiene', 'Salud']
const ESPECIES = ['Perro', 'Gato']

const formVacio = { nombre: '', descripcion: '', precio: '', especie: 'Perro', categoria: 'Alimento', stock: '', imagen: '' }

function Admin() {
  const { sesion } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('productos')
  const [productos, setProductos] = useState([])
  const [ordenes, setOrdenes] = useState([])
  const [form, setForm] = useState(formVacio)
  const [editandoId, setEditandoId] = useState(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState(null)

  useEffect(() => {
    if (!sesion || sesion.usuario.rol !== 'admin') {
      navigate('/')
      return
    }
    cargarProductos()
  }, [])

  function cabeceras() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sesion.token}`
    }
  }

  async function cargarProductos() {
    const r = await fetch('/api/productos')
    setProductos(await r.json())
  }

  async function cargarOrdenes() {
    const r = await fetch('/api/admin/ordenes', { headers: cabeceras() })
    setOrdenes(await r.json())
  }

  function handleTab(t) {
    setTab(t)
    if (t === 'ordenes') cargarOrdenes()
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrores({ ...errores, [e.target.name]: null })
  }

  function validar() {
    const nuevosErrores = {}
    if (!form.nombre.trim()) nuevosErrores.nombre = 'Obligatorio'
    if (!form.descripcion.trim()) nuevosErrores.descripcion = 'Obligatorio'
    if (!form.precio || Number(form.precio) < 0) nuevosErrores.precio = 'Debe ser un número positivo'
    if (form.stock === '' || Number(form.stock) < 0) nuevosErrores.stock = 'Debe ser un número positivo'
    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  async function guardar() {
    if (!validar()) return
    setErrorGeneral(null)

    const datos = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      precio: Number(form.precio),
      especie: form.especie,
      categoria: form.categoria,
      stock: Number(form.stock),
      imagen: form.imagen.trim()
    }

    const url = editandoId ? `/api/admin/productos/${editandoId}` : '/api/admin/productos'
    const method = editandoId ? 'PUT' : 'POST'

    const respuesta = await fetch(url, { method, headers: cabeceras(), body: JSON.stringify(datos) })
    const resultado = await respuesta.json()

    if (respuesta.ok) {
      setMostrarForm(false)
      setForm(formVacio)
      setEditandoId(null)
      cargarProductos()
    } else {
      setErrorGeneral(resultado.error)
    }
  }

  function editar(producto) {
    setForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      especie: producto.especie,
      categoria: producto.categoria,
      stock: producto.stock,
      imagen: producto.imagen
    })
    setEditandoId(producto._id)
    setErrores({})
    setErrorGeneral(null)
    setMostrarForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelar() {
    setMostrarForm(false)
    setForm(formVacio)
    setEditandoId(null)
    setErrores({})
    setErrorGeneral(null)
  }

  async function eliminar(id) {
    if (!confirm('¿Seguro que querés eliminar este producto?')) return
    await fetch(`/api/admin/productos/${id}`, { method: 'DELETE', headers: cabeceras() })
    cargarProductos()
  }

  return (
    <div className="admin-contenedor">
      <div className="admin-tabs">
        <button className={`tab-btn ${tab === 'productos' ? 'tab-activo' : ''}`} onClick={() => handleTab('productos')}>Productos</button>
        <button className={`tab-btn ${tab === 'ordenes' ? 'tab-activo' : ''}`} onClick={() => handleTab('ordenes')}>Órdenes</button>
      </div>

      {tab === 'productos' && (
        <>
          <div className="admin-encabezado">
            <h2>Gestión de productos</h2>
            <button className="btn-nuevo-producto" onClick={() => { cancelar(); setMostrarForm(true) }}>+ Nuevo producto</button>
          </div>

          {mostrarForm && (
            <div className="form-producto">
              <h3>{editandoId ? 'Editar producto' : 'Nuevo producto'}</h3>
              {errorGeneral && <div className="mensaje-error">{errorGeneral}</div>}

              <div className="form-grid">
                {[
                  { name: 'nombre', label: 'Nombre', type: 'text' },
                  { name: 'precio', label: 'Precio', type: 'number' },
                  { name: 'stock', label: 'Stock', type: 'number' },
                  { name: 'imagen', label: 'URL de imagen', type: 'text' }
                ].map(({ name, label, type }) => (
                  <div className="form-grupo" key={name}>
                    <label>{label}</label>
                    <input type={type} name={name} value={form[name]} onChange={handleChange} className={errores[name] ? 'input-error' : ''} />
                    {errores[name] && <span className="campo-error">{errores[name]}</span>}
                  </div>
                ))}

                <div className="form-grupo">
                  <label>Especie</label>
                  <select name="especie" value={form.especie} onChange={handleChange}>
                    {ESPECIES.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>

                <div className="form-grupo">
                  <label>Categoría</label>
                  <select name="categoria" value={form.categoria} onChange={handleChange}>
                    {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-grupo">
                <label>Descripción</label>
                <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows="3" className={errores.descripcion ? 'input-error' : ''} />
                {errores.descripcion && <span className="campo-error">{errores.descripcion}</span>}
              </div>

              <div className="form-acciones">
                <button className="btn-form" onClick={guardar}>Guardar</button>
                <button className="btn-cancelar" onClick={cancelar}>Cancelar</button>
              </div>
            </div>
          )}

          <table className="tabla-admin">
            <thead>
              <tr>
                <th>Nombre</th><th>Especie</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(p => (
                <tr key={p._id}>
                  <td>{p.nombre}</td>
                  <td>{p.especie}</td>
                  <td>{p.categoria}</td>
                  <td>${p.precio.toLocaleString('es-AR')}</td>
                  <td>{p.stock}</td>
                  <td className="acciones-celda">
                    <button className="btn-editar" onClick={() => editar(p)}>Editar</button>
                    <button className="btn-eliminar-prod" onClick={() => eliminar(p._id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {tab === 'ordenes' && (
        <>
          <h2>Órdenes recientes</h2>
          <table className="tabla-admin">
            <thead>
              <tr><th>ID</th><th>Cliente</th><th>Total</th><th>Estado</th><th>Fecha</th></tr>
            </thead>
            <tbody>
              {ordenes.map(o => (
                <tr key={o._id}>
                  <td className="id-corto">{o._id.slice(-6)}</td>
                  <td>{o.usuario ? o.usuario.nombre : 'Usuario eliminado'}</td>
                  <td>${o.total.toLocaleString('es-AR')}</td>
                  <td><span className={`badge-estado badge-${o.estado}`}>{o.estado}</span></td>
                  <td>{new Date(o.createdAt).toLocaleDateString('es-AR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}

export default Admin