import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import API from "../services/api";
import toast from "react-hot-toast";
import { clearCart } from "../redux/cartSlice";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ClipLoader } from "react-spinners";

function PaymentVerify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get("reference");

      if (!reference) {
        toast.error("NO PAYMENT REFERENCE FOUND");
        navigate("/cart");
        return;
      }

      try {
        const { data } = await API.get(`/payment/verify/${reference}`);

        if (data.success) {
          toast.success("PAYMENT SUCCESSFUL!");
          dispatch(clearCart());
          navigate("/orders");
        } else {
          toast.error("PAYMENT FAILED");
          navigate("/cart");
        }
      } catch (err) {
        console.log("VERIFY ERROR:", err.response?.data);
        toast.error("PAYMENT VERIFICATION FAILED");
        navigate("/cart");
      }
    };

    verifyPayment();
  }, [searchParams, navigate, dispatch]);

  return (
    <div style={{ background: "#0a0a0a", color: "#fff", minHeight: "100vh" }}>
      <Navbar />
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        gap: "1rem"
      }}>
        <ClipLoader color="#FF0000" size={50} />
        <h2>VERIFYING PAYMENT...</h2>
        <p style={{ color: "#888" }}>Please wait, do not close this page</p>
      </div>
      <Footer />
    </div>
  );
}

export default PaymentVerify;