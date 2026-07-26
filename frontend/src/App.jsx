import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Catalogo from './pages/Catalogo.jsx'
import Producto from './pages/Producto.jsx'
import Carrito from './pages/Carrito.jsx'
import Login from './pages/Login.jsx'
import Registro from './pages/Registro.jsx'
import Pago from './pages/Pago.jsx'
import Confirmacion from './pages/Confirmacion.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Catalogo />} />
          <Route path="productos" element={<Catalogo />} />
          <Route path="producto/:id" element={<Producto />} />
          <Route path="carrito" element={<Carrito />} />
          <Route path="login" element={<Login />} />
          <Route path="registro" element={<Registro />} />
          <Route path="pago" element={<Pago />} />
          <Route path="confirmacion" element={<Confirmacion />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App