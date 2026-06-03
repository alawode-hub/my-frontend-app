import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, token, loading } = useSelector((state) => state.auth);

  console.log("ProtectedRoute - user:", user, "token:", token, "loading:", loading); // DEBUG

  // If loading too long, force stop am
  if (loading) {
    return <div style={{background:'#0a0a0a', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px'}}>Loading auth... if e stuck, refresh page</div>;
  }

  if (!user ||!token) {
    console.log("No user/token, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role!== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;