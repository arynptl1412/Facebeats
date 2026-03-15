import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Face from './features/expressions/pages/Face'
import Login from './features/auth/pages/Login'
import { AuthProvider } from './features/auth/auth.context'
import Register from './features/auth/pages/Register'
const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<h1>Welcome to the Homepage</h1>} />
          <Route path='/face' element={<Face />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App