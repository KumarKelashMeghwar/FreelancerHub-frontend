import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext.jsx";
import Dashboard from "./dashboard/freelancer/Dashboard.jsx";
import Admin from "./dashboard/admin/Admin";
import Register from "./pages/Register";
import Gigs from "./dashboard/freelancer/Gigs";
import UserPage from "./dashboard/admin/UserPage";
import {Dashboard as AdminDashboard} from "./dashboard/admin/Dashboard";
import AddGig from "./dashboard/freelancer/AddGig";


// Private Route Component
const PrivateRoute = ({ children }) => {
  let { user } = useContext(AuthContext);
  user = user || JSON.parse(localStorage.getItem("user"));


  if (!user || user.role == "ROLE_ADMIN") {
    return <Navigate to="/login" replace />;
  }


  return children;
};

const AdminRoute = ({ children }) => {
  let { user } = useContext(AuthContext);

  user = user || JSON.parse(localStorage.getItem("user"));

  if (!user || user.role != "ROLE_ADMIN") {

    return <Navigate to={"/login"} replace />;
  }

  return children;

}

const AppContent = () => {

  const hideHeader = ["/super-admin"];
  const location = useLocation();

  return (
    <>
      {!location.pathname.includes(hideHeader[0]) && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<h1>Welcome Home</h1>} />
        <Route path="/home" element={<h1>Home Page</h1>} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        {/* Freelancer Routes */}
        <Route path="/users">
          <Route path=":name/seller_dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path=":name/gigs" element={<PrivateRoute><Gigs /></PrivateRoute>} />
          <Route path=":name/create_gig" element={<PrivateRoute><AddGig /></PrivateRoute>} />
        </Route>

        <Route path="/super-admin" element={<AdminRoute><Admin /></AdminRoute>}>
          <Route path="" index element={<AdminDashboard/>} />
          <Route path="users" element={<UserPage />} />
          <Route path="settings" element={<>Settings</>} />
        </Route>


      </Routes>
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App;
