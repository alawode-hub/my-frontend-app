import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, resetError, resetSuccess } from "../redux/authSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";

// PASSWORD VALIDATION 
const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[@$!%*?&]/.test(password);

  if (password.length < minLength) return "Password must be at least 8 characters";
  if (!hasUpperCase) return "Password must contain 1 uppercase letter";
  if (!hasLowerCase) return "Password must contain 1 lowercase letter"; 
  if (!hasNumber) return "Password must contain 1 number";
  if (!hasSpecialChar) return "Password must contain 1 special character @$!%*?&";
  
  return "";
};

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, successMessage } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // VALIDATE PASSWORD BEFORE SUBMIT
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      toast.error(passwordError.toUpperCase());
      return;
    }
    
    dispatch(registerUser(formData));
  };

  useEffect(() => {
    if (error) {
      toast.error(error.toUpperCase());
      dispatch(resetError());
    }
    if (successMessage) {
      toast.success(successMessage.toUpperCase(), { duration: 2000 });
      
      setTimeout(() => {
        dispatch(resetSuccess());
        navigate("/login");
      }, 2000);
    }
  }, [error, successMessage, navigate, dispatch]);

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2>REGISTER</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            placeholder="First Name"
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            placeholder="Last Name"
          />
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
          <small style={{color: '#777', fontSize: '0.75rem', display: 'block', marginTop: '5px'}}>
            Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special @$!%*?&
          </small>
          <button 
            type="submit" 
            className="btn-white" 
            disabled={loading}
            style={{ 
              width: '100%',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '10px',
              marginTop: '15px'
            }}
          >
            {loading ? (
              <>
                <ClipLoader size={18} color="#000" />
                CREATING ACCOUNT...
              </>
            ) : (
              "REGISTER"
            )}
          </button>
        </form>
        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;