import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from "react-redux";
import axios from 'axios';
import { clearCart } from "../redux/cartSlice";
import toast from 'react-hot-toast';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reference = searchParams.get('reference');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference) {
        toast.error("No payment reference found");
        navigate('/cart', { replace: true });
        return;
      }

      try {
        const token = JSON.parse(localStorage.getItem('user'))?.token; // FIXED
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URI}/api/payment/verify/${reference}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (data.success) {
          // Clear cart here too - in case user lands here directly
          dispatch(clearCart());
          localStorage.removeItem("cartItems");

          toast.success("Payment successful! ✅");

          // Don't auto-redirect immediately. Let user see success page
          // Add button to go to shop instead
        } else {
          toast.error("Payment failed");
          navigate('/cart', { replace: true });
        }
      } catch (err) {
        toast.error("Verification failed");
        navigate('/cart', { replace: true });
      }
    };

    verifyPayment();
  }, [reference, navigate, dispatch]);

  return (
    <div style={{ background: "#0a0a0a", color: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem", padding: "2rem" }}>
      <h2 style={{ fontSize: "2rem", fontWeight: "900", letterSpacing: "2px" }}>PAYMENT SUCCESSFUL ✅</h2>
      <p style={{ color: "#999" }}>Thank you for your purchase!</p>
      <button
        onClick={() => navigate('/shop', { replace: true })}
        style={{
          background: "#FF0000",
          color: "#fff",
          border: "none",
          padding: "1rem 2rem",
          fontSize: "0.85rem",
          fontWeight: "700",
          letterSpacing: "1.5px",
          cursor: "pointer"
        }}
      >
        CONTINUE SHOPPING
      </button>
    </div>
  );
};

export default PaymentSuccess;