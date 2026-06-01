import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../services/api";
import { clearCart } from "../redux/cartSlice";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

const PaymentVerify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get("reference");

      if (!reference) {
        toast.error("INVALID PAYMENT REFERENCE");
        navigate("/cart", { replace: true });
        return;
      }

      try {
        const token = user?.token;

        const { data } = await API.get(`/payment/verify/${reference}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (data.success) {
          // Clear cart BEFORE navigate
          dispatch(clearCart());
          localStorage.removeItem("cartItems"); // extra safety
          localStorage.removeItem(`shippingAddress_${user?._id}`);

          toast.success("PAYMENT SUCCESSFUL 🔥");

          setTimeout(() => {
            navigate("/payment-success", { replace: true });
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
  }, [searchParams, navigate, dispatch, user]);

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