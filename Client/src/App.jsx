import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { PostCard, SideBar, Footer } from './components'
import {Signup, Home, Profile} from "./pages"
import Layout from './Layout'
import CreatePost from './components/CreatePost'
import ProtectedRoutes from './components/ProtectedRoutes/Protected'
import PublicRoute from './components/ProtectedRoutes/Public'
function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Footer />} /> */}
        <Route path="/:signup" element={
        <PublicRoute>
          <Signup />
        </PublicRoute>
        } 
        />
        <Route path="/:signin" element={
        <PublicRoute>
          <Signup/>
        </PublicRoute>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={
        <ProtectedRoutes>
          <Layout />
        </ProtectedRoutes>
        }>
          <Route index element={<Home />} />
          <Route path="add-post" element={<CreatePost />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
