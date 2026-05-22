import { useState } from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LogoutButton = () => {
  const [showModal, setShowModal] = useState(false); // 1. add this
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser()); // Clears Redux + localStorage
    toast.success("Logged out successfully");
    navigate("/login");
    setShowModal(false); // close modal after logout
  };

  return (
    <>
      <button onClick={() => setShowModal(true)} className="btn-white">
        LOGOUT
      </button>

      {/* 2. Modal only shows when showModal = true */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 text-center">
            <h2 className="text-lg font-semibold mb-3">Logout</h2>
            <p className="text-gray-600 mb-5">Are you sure you want to logout?</p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-200 rounded py-2 hover:bg-gray-300"
              >
                No
              </button>
              <button 
                onClick={handleLogout}
                className="flex-1 bg-red-500 text-white rounded py-2 hover:bg-red-600"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LogoutButton;