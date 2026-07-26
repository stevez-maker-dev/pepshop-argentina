import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCarrito } from '../context/CarritoContext.jsx'
import './Header.css'

function Header() {
  const { sesion, cerrarSesion } = useAuth()
  const { totalItems } = useCarrito()
  const navigate = useNavigate()

  function handleCerrarSesion() {
    cerrarSesion()
    navigate('/')
  }

  return (
    <header className="header">
      <Link to="/" className="header-logo">PepShop Argentina</Link>
      <nav>
        <ul className="nav-lista">
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/productos?especie=Perro">Perros</Link></li>
          <li><Link to="/productos?especie=Gato">Gatos</Link></li>
          <li>
            <Link to="/carrito" className="nav-carrito">
              Carrito
              {totalItems > 0 && <span className="contador-carrito">{totalItems}</span>}
            </Link>
          </li>
          {sesion ? (
            <>
              {sesion.usuario.rol === 'admin' && (
                <li><Link to="/admin" className="nav-admin">Panel admin</Link></li>
              )}
              <li><Link to="/mis-ordenes">Mis órdenes</Link></li>
              <li><Link to="/perfil">Mi perfil</Link></li>
              <li>
                <span className="nav-usuario">Hola, {sesion.usuario.nombre.split(' ')[0]}</span>
                <button className="btn-cerrar-sesion" onClick={handleCerrarSesion}>Salir</button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/registro">Registrarse</Link></li>
              <li><Link to="/login">Ingresar</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  )
}

export default Header