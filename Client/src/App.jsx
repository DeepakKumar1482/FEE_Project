import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import {
//   PostCard,
//   SideBar,
//   Footer,
//   ImageCarousel,
//   FullPreview,
// } from "./components";
import { Signup, Home, Profile, TextLoader } from "./pages";
import Layout from "./Layout";
import CreatePost from "./components/CreatePost";
import ProtectedRoutes from "./components/ProtectedRoutes/Protected";
import PublicRoute from "./components/ProtectedRoutes/Public";
import Message from "./components/Message";
import UserProfile from "./components/UserProfile";
import { UserProvider } from "./ContextApi/UserContext"; // Import UserProvider
import { SocketContextProvider } from "./context/Socket";
import Saved from "./pages/Saved";
import Payment from "./pages/payment";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* <Route path="/" element={<Footer />} /> */}
          <Route
            path="/:signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
          <Route
            path="/userprofile/:username"
            element={
              <ProtectedRoutes>
                <UserProfile />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/:signin"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
          <Route path="/profile" element={
            // <ProtectedRoutes>
              <Profile />
            // </ProtectedRoutes>
            } />
          <Route
            path="/"
            element={
              <ProtectedRoutes>
                <SocketContextProvider>
                  <Layout />
                </SocketContextProvider>
              </ProtectedRoutes>
            }
          >
            <Route index element={<Home />} />
            <Route path="add-post" element={<CreatePost />} />
            <Route path="/messages" element={<Message />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/payment" element={<Payment />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;