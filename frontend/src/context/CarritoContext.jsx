import { createContext, useContext, useState } from 'react'

const CarritoContext = createContext()

function obtenerCarritoInicial() {
  const datos = localStorage.getItem('carrito')
  return datos ? JSON.parse(datos) : []
}

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState(obtenerCarritoInicial)

  function guardarCarrito(nuevoCarrito) {
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito))
    setCarrito(nuevoCarrito)
  }

  function agregarAlCarrito(id, cantidad = 1) {
    const carritoActual = [...carrito]
    const itemExistente = carritoActual.find(item => item.id === id)
    if (itemExistente) {
      itemExistente.cantidad += cantidad
    } else {
      carritoActual.push({ id, cantidad })
    }
    guardarCarrito(carritoActual)
  }

  function eliminarDelCarrito(id) {
    guardarCarrito(carrito.filter(item => item.id !== id))
  }

  function cambiarCantidad(id, cantidad) {
    guardarCarrito(carrito.map(item => item.id === id ? { ...item, cantidad } : item))
  }

  function vaciarCarrito() {
    guardarCarrito([])
  }

  const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0)

  return (
    <CarritoContext.Provider value={{ carrito, agregarAlCarrito, eliminarDelCarrito, cambiarCantidad, vaciarCarrito, totalItems }}>
      {children}
    </CarritoContext.Provider>
  )
}

export function useCarrito() {
  return useContext(CarritoContext)
}