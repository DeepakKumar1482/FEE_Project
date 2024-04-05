import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PostCard, SideBar } from './components'
import Signup from './pages/Signup'
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route element={<SideBar />} path='/'/>
      <Route element={<Signup  />} path='/:signup'/>
      <Route element={<Signup  />} path='/:signin'/>
      <Route element={<PostCard  />} path='/postcard'/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
