import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(() => {
    const token = localStorage.getItem('token')
    const usuario = localStorage.getItem('usuario')
    return token ? { token, usuario: JSON.parse(usuario) } : null
  })

  function guardarSesion(token, usuario) {
    localStorage.setItem('token', token)
    localStorage.setItem('usuario', JSON.stringify(usuario))
    setSesion({ token, usuario })
  }

  function cerrarSesion() {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setSesion(null)
  }

  return (
    <AuthContext.Provider value={{ sesion, guardarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}