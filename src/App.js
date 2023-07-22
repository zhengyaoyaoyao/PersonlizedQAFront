import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './Layout'
import Login from './pages/Login'
function App () {
  return (<BrowserRouter>
    <div className="App">
      <Routes>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/*' element={<Layout />}></Route>
      </Routes>
    </div>
  </BrowserRouter>)
}

export default App
