import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reference = searchParams.get('reference');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference) {
        toast.error("No payment reference found");
        navigate('/cart');
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URI}/api/payment/verify/${reference}`, // FIXED
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (data.success) {
          toast.success("Payment successful! ✅");
          setTimeout(() => navigate('/shop'), 2000);
        } else {
          toast.error("Payment failed");
          navigate('/cart');
        }
      } catch (err) {
        toast.error("Verification failed");
        navigate('/cart');
      }
    };

    verifyPayment();
  }, [reference, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h2 className="text-2xl font-bold mb-2">Verifying your payment...</h2>
      <p>Please don’t close this page</p>
    </div>
  );
};

export default PaymentSuccess;