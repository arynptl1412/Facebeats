import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Face from './features/expressions/pages/Face'
import Login from './features/auth/pages/Login'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/face' element={<Face/>}/>
        <Route path='/login' element = {<Login/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App