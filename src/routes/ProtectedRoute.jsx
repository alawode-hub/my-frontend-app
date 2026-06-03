import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom"; 

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) return <div style={{color: '#fff', textAlign: 'center', padding: '50px'}}>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />; 
};

export default ProtectedRoute;