import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { clearCart } from "../redux/cartSlice"; 
import toast from "react-hot-toast";

const PaymentVerify = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reference = searchParams.get("reference");

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference) return;

      try {
        const res = await API.get(`/payment/verify/${reference}`);

        if (res.data.success) {
          // Clear cart immediately
          dispatch(clearCart());

          // Double clear after 500ms
          setTimeout(() => {
            dispatch(clearCart());
            localStorage.removeItem("cartItems");
          }, 500);

          toast.success("Payment successful! Cart cleared.");
          navigate("/orders");
        }
      } catch (err) {
        toast.error("Payment verification failed");
        navigate("/checkout");
      }
    };

    verifyPayment();
  }, [reference, dispatch, navigate]);

  return <div>Verifying payment...</div>;
};

export default PaymentVerify;