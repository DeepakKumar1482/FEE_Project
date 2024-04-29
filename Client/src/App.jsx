import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { PostCard, SideBar, Footer, ImageCarousel, FullPreview } from './components'
import {Signup, Home, Profile} from "./pages"
import Layout from './Layout'
import CreatePost from './components/CreatePost'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Footer />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile-view" element={<Profile />} />
        <Route path="/layout" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="post" element={<CreatePost />} />
          <Route path="add-post" element={<FullPreview />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
