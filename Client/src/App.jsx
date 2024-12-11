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
import Notifications from "./components/Notifications";
import SearchComponent from "./components/Searching";
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
            <Route
            path="/notifications"
            element={
              <ProtectedRoutes>
                <Notifications />
              </ProtectedRoutes>
            }
          ></Route>
          <Route
            path="/userprofile/:username"
            element={
                <UserProfile />
            }
          />
            <Route index element={<Home />} />
            <Route path="add-post" element={<CreatePost />} />
            <Route path="search" element={<SearchComponent />} />
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