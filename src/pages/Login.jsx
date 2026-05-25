import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, resetError, resetSuccess } from "../redux/authSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user, successMessage } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  useEffect(() => {
    if (error) {
      toast.error(error.toUpperCase());
      dispatch(resetError());
    }
    
    if (successMessage && user) {
      toast.success(successMessage.toUpperCase(), { duration: 2000 });
      
      // wait 2s for toast to show, then navigate and reset
      setTimeout(() => {
        dispatch(resetSuccess());
        if (user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/shop");
        }
      }, 2000);
    }
  }, [error, successMessage, user, navigate, dispatch]);

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2>LOGIN</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Email"
          />
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Password"
            />
            <span
              style={{
                position: "absolute",
                right: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#777"
              }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button 
            type="submit" 
            className="btn-white" 
            disabled={loading}
            style={{ 
              width: '100%',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '10px' 
            }}
          >
            {loading ? (
              <>
                <ClipLoader size={18} color="#000" />
                LOGGING IN...
              </>
            ) : (
              "LOGIN"
            )}
          </button>
        </form>
        <p className="auth-link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;