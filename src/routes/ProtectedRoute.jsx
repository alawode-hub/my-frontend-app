import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, loading } = useSelector((state) => state.auth);

  // 1. Wait until Redux check if user dey localStorage
  if (loading) {
    return <div style={{background:'#0a0a0a', color:'#fff', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>Loading...</div>;
  }

  // 2. If no user after loading, go login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. If admin only but user not admin
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // 4. If ok, show the page
  return <Outlet />;
};

export default ProtectedRoute;