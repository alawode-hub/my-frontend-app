import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { clearCart } from "../redux/cartSlice";
import toast from "react-hot-toast";
import API from "../services/api";
import { ClipLoader } from "react-spinners";

const PaymentVerify = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reference = searchParams.get("reference");

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference) {
        toast.error("INVALID PAYMENT REFERENCE");
        navigate("/cart", { replace: true });
        return;
      }

      try {
        // Get token with fallback
        const userStr = localStorage.getItem("user");
        const user = userStr? JSON.parse(userStr) : null;
        const token = user?.token;

        console.log("VERIFY TOKEN EXISTS:",!!token);

        // Send request - headers optional now since route is public
        const headers = token? { Authorization: `Bearer ${token}` } : {};
        const { data } = await API.get(`/payment/verify/${reference}`, { headers });

        if (data.success) {
          console.log("BEFORE CLEAR:", localStorage.getItem("cartItems"));

          // NUCLEAR CLEAR - wipe everything
          localStorage.clear();
          dispatch(clearCart());
          localStorage.setItem("cartItems", "[]");
          localStorage.setItem("shippingAddress", "{}");

          console.log("AFTER CLEAR:", localStorage.getItem("cartItems"));

          toast.success("PAYMENT SUCCESSFUL! Cart cleared 🔥");

          // Full reload to kill old Redux state
          setTimeout(() => {
            window.location.href = "/orders";
          }, 800);
        } else {
          toast.error("PAYMENT FAILED");
          navigate("/cart", { replace: true });
        }
      } catch (err) {
        console.log("PAYMENT VERIFY ERROR:", err.response?.status, err.response?.data);
        toast.error("PAYMENT VERIFICATION FAILED");
        navigate("/cart", { replace: true });
      }
    };

    verifyPayment();
  }, [reference, dispatch, navigate]);

  return (
    <div style={{
      background: "#0a0a0a",
      color: "#fff",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "1rem"
    }}>
      <ClipLoader color="#FF0000" size={50} />
      <p style={{ letterSpacing: "1px" }}>VERIFYING PAYMENT...</p>
    </div>
  );
};

export default PaymentVerify;