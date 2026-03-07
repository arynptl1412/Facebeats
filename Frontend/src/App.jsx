import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Face from './features/expressions/pages/Face'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/face' element={<Face/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App