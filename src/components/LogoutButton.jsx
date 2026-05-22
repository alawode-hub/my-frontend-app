import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    
    if (confirmed) {
      dispatch(logoutUser());
      toast.success("Logged out successfully");
      navigate("/login");
    }
  };

  return (
    <button onClick={handleLogout} className="btn-white">
      LOGOUT
    </button>
  );
};

export default LogoutButton;