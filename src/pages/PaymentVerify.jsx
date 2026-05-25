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
      
      if (!reference) {
        toast.error("INVALID PAYMENT REFERENCE");
        navigate("/cart");
        return;
      }

      try {
        const token = JSON.parse(localStorage.getItem("user"))?.token;
        const { data } = await API.get(`/payment/verify/${reference}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (data.success) {
          dispatch(clearCart()); // clear cart in redux
          localStorage.removeItem("cartItems"); // clear localStorage too
          
          toast.success("PAYMENT SUCCESSFUL 🔥");
          
          setTimeout(() => {
            navigate("/shop"); // redirect to shop, not cart
          }, 1500);
        } else {
          toast.error("PAYMENT FAILED");
          navigate("/cart");
        }
      } catch (err) {
        console.log(err);
        toast.error("PAYMENT VERIFICATION FAILED");
        navigate("/cart");
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