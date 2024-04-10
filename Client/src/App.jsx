import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { PostCard, SideBar, Footer } from './components'
import {Signup, Home, Profile} from "./pages"
import Layout from './Layout'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Footer />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile-view" element={<Profile />} />
        <Route path="/layout" element={<Layout />}>
          <Route index element={<Home />} />
          {/* <Route path="about" element={<About />} /> */}
        </Route>
      </Routes>
    </Router>
  )
}

export default App
