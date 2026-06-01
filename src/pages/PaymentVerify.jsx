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
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user?.token;

        const { data } = await API.get(`/payment/verify/${reference}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (data.success) {
          console.log("BEFORE CLEAR:", localStorage.getItem("cartItems"));

          // NUCLEAR: Clear everything first
          localStorage.clear();

          // Then clear Redux
          dispatch(clearCart());

          // Set empty to prevent rehydration
          localStorage.setItem("cartItems", "[]");
          localStorage.setItem("shippingAddress", "{}");

          console.log("AFTER CLEAR:", localStorage.getItem("cartItems"));

          toast.success("PAYMENT SUCCESSFUL! Cart cleared 🔥");

          // Force reload ONCE to kill Redux state completely
          setTimeout(() => {
            window.location.href = "/orders";
          }, 800);
        } else {
          toast.error("PAYMENT FAILED");
          navigate("/cart", { replace: true });
        }
      } catch (err) {
        console.log("PAYMENT VERIFY ERROR:", err);
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