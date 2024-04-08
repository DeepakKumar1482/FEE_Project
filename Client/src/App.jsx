import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PostCard, SideBar } from './components'
import Signup from './pages/Signup'
import Profile from './Profile'
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route element={<SideBar />} path='/'/>
      <Route element={<Signup  />} path='/:signup'/>
      <Route element={<Signup  />} path='/:signin'/>
      <Route element={<PostCard  />} path='/postcard'/>
      <Route element={<Profile />} path='/user'/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
