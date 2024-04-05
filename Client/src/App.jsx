import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SideBar } from './components'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route element={<SideBar />} path='/'/>
      <Route element={<Signup  />} path='/:signup'/>
      <Route element={<Signup  />} path='/:signin'/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
