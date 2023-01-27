import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Chat from './Pages/Chat'
import Snackbar from "./components/Snackbar";
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Snackbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </div>
  )
}

export default App
