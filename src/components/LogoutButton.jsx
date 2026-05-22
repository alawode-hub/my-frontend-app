import { useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LogoutButton = () => {
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("Logged out successfully");
    navigate("/login");
    setShowModal(false);
  };

  const Modal = () => {
    if (!showModal) return null;

    return createPortal(
      <div 
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 99999
        }}
        onClick={() => setShowModal(false)}
      >
        <div 
          style={{
            backgroundColor: "white",
            color: "black",
            padding: "24px",
            borderRadius: "8px",
            width: "320px",
            textAlign: "center"
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>
            Logout
          </h2>
          <p style={{ color: "#6b7280", marginBottom: "20px" }}>
            Are you sure you want to logout?
          </p>
          
          <div style={{ display: "flex", gap: "12px" }}>
            <button 
              onClick={() => setShowModal(false)}
              style={{
                flex: 1,
                backgroundColor: "#e5e7eb",
                padding: "10px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                fontWeight: "600"
              }}
            >
              No
            </button>
            <button 
              onClick={handleLogout}
              style={{
                flex: 1,
                backgroundColor: "#ef4444",
                color: "white",
                padding: "10px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                fontWeight: "600"
              }}
            >
              Yes
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <>
      <button 
        onClick={() => setShowModal(true)} 
        className="btn-white"
      >
        LOGOUT
      </button>

      <Modal />
    </>
  );
};

export default LogoutButton;