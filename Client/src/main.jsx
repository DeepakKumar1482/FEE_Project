import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Profile from './pages/Profile.jsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'


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

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  // <SocketProvider>
  <QueryClientProvider client={queryClient}>
    <App/>
  </QueryClientProvider>
  // </SocketProvider>
  // </React.StrictMode>,
)
