import { useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/authSlice";
import { resetCart } from "../redux/cartSlice"; 
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LogoutButton = () => {
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("LOGGED OUT SUCCESSFULLY");
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
          backgroundColor: "rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 99999
        }}
        onClick={() => setShowModal(false)}
      >
        <div 
          style={{
            backgroundColor: "#111",
            color: "white",
            padding: "24px",
            borderRadius: "8px",
            width: "320px",
            textAlign: "center",
            border: "1px solid #333"
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 style={{ fontSize: "18px", fontWeight: "900", marginBottom: "12px", letterSpacing: "1px" }}>
            LOGOUT
          </h2>
          <p style={{ color: "#999", marginBottom: "20px", fontSize: "14px" }}>
            ARE YOU SURE YOU WANT TO LOGOUT?
          </p>
          
          <div style={{ display: "flex", gap: "12px" }}>
            <button 
              onClick={() => setShowModal(false)}
              style={{
                flex: 1,
                backgroundColor: "transparent",
                border: "1px solid #333",
                color: "#fff",
                padding: "10px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "700",
                letterSpacing: "1px"
              }}
            >
              NO
            </button>
            <button 
              onClick={handleLogout}
              style={{
                flex: 1,
                backgroundColor: "#FF0000",
                color: "white",
                padding: "10px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                fontWeight: "700",
                letterSpacing: "1px"
              }}
            >
              YES
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
        style={{ background: "transparent", border: "1px solid #fff" }}
      >
        LOGOUT
      </button>

      <Modal />
    </>
  );
};

export default LogoutButton;