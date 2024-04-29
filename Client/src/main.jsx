import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Profile from './pages/Profile.jsx'
import './index.css'


// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <Routes>
//       <Route path="/" element={<Footer />}/>
//       <Route path="/signup" element={<Signup />} />
//       <Route path="/layout" element={<Layout />}>
//         <Route path="" element={<Home />} />
//         {/* <Route path="about" element={<About />} /> */}
//       </Route>
//     </Routes>
//   )
// )

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
)
