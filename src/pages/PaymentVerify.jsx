import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../services/api";
import { clearCart } from "../redux/cartSlice";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

const PaymentVerify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get("reference");

      console.log("PAYMENT VERIFY START - REFERENCE:", reference); // DEBUG

      if (!reference) {
        toast.error("INVALID PAYMENT REFERENCE");
        navigate("/cart", { replace: true });
        return;
      }

      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user?.token;

        console.log("PAYMENT VERIFY - USER ID:", user?._id); // DEBUG
        console.log("PAYMENT VERIFY - TOKEN EXISTS:",!!token); // DEBUG

        const { data } = await API.get(`/payment/verify/${reference}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log("PAYMENT VERIFY RESPONSE:", data); // DEBUG

        if (data.success) {
          console.log("BEFORE CLEARCART - CART LS:", localStorage.getItem("cartItems")); // DEBUG

          dispatch(clearCart());

          console.log("AFTER CLEARCART - CART LS:", localStorage.getItem("cartItems")); // DEBUG
          console.log("AFTER CLEARCART - SHIPPING LS:", localStorage.getItem(`shippingAddress_${user?._id}`)); // DEBUG

          toast.success("PAYMENT SUCCESSFUL 🔥");

          setTimeout(() => {
            navigate("/payment-success", { replace: true });
            window.location.reload(); // FORCE RELOAD TO CLEAR CART STATE
          }, 1000);
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
  }, [searchParams, navigate, dispatch]);

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