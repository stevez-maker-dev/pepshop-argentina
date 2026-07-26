import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Catalogo from './pages/Catalogo.jsx'
import Producto from './pages/Producto.jsx'
import Carrito from './pages/Carrito.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Catalogo />} />
          <Route path="productos" element={<Catalogo />} />
          <Route path="producto/:id" element={<Producto />} />
          <Route path="carrito" element={<Carrito />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App