import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { saveShippingAddress } from "../redux/cartSlice";
import API from "../services/api";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

function Checkout() {
  // FIXED: read from state.cartItems
  const cartItems = useSelector((state) => state.cartItems);
  const shippingAddress = useSelector((state) => state.cart.shippingAddress);
  const { user } = useSelector((state) => state.auth);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: shippingAddress.fullName || "",
    address: shippingAddress.address || "",
    city: shippingAddress.city || "",
    phone: shippingAddress.phone || ""
  });
  const [loading, setLoading] = useState(false);

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 50000 ? 0 : 2000;
  const totalPrice = itemsPrice + shippingPrice;

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!form.fullName || !form.address || !form.city || !form.phone) {
      toast.error("PLEASE FILL ALL SHIPPING FIELDS");
      return;
    }

    if (!user || !user._id) {
      toast.error("PLEASE LOGIN FIRST");
      setTimeout(() => navigate("/login"), 1000);
      return;
    }

    const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);
    for (let item of cartItems) {
      if (!isValidObjectId(item._id)) {
        toast.error("INVALID PRODUCT ID IN CART. CLEAR CART AND ADD AGAIN");
        return;
      }
    }

    setLoading(true);
    try {
      dispatch(saveShippingAddress(form));

      const token = user.token;

      const { data: order } = await API.post("/orders", {
        orderItems: cartItems.map(item => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item._id
        })),
        shippingAddress: form,
        itemsPrice,
        shippingPrice,
        totalPrice,
        paymentMethod: "Paystack",
        isPaid: false
      }, { headers: { Authorization: `Bearer ${token}` } });

      const { data: payment } = await API.post("/payment/initialize", {
        email: user.email,
        amount: totalPrice,
        orderId: order._id,
        callback_url: `${window.location.origin}/payment/verify`
      }, { headers: { Authorization: `Bearer ${token}` } });

      window.location.href = payment.data.authorization_url;

    } catch (err) {
      console.log("CHECKOUT ERROR:", err.response?.data);
      toast.error(err.response?.data?.message || "CHECKOUT FAILED. TRY AGAIN");
      setLoading(false);
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div style={{ background: "#0a0a0a", color: "#fff", minHeight: "100vh" }}>
        <Navbar />
        <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
          <p style={{ fontSize: "1.2rem", color: "#666", marginBottom: "2rem" }}>YOUR CART IS EMPTY</p>
          <Link to="/shop" style={{
            background: "#FF0000",
            color: "#fff",
            padding: "1rem 2rem",
            textDecoration: "none",
            fontWeight: "700",
            letterSpacing: "1px"
          }}>
            CONTINUE SHOPPING
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ background: "#0a0a0a", color: "#fff", minHeight: "100vh" }}>
      <Navbar />
      
      <style>{`
        .checkout-layout {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 4rem;
          align-items: start;
        }
        @media (max-width: 900px) {
          .checkout-layout {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }
      `}</style>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "4rem 2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "900", letterSpacing: "2px", marginBottom: "3rem" }}>
          CHECKOUT
        </h1>

        <form onSubmit={handleCheckout} className="checkout-layout">
          <div>
            <h2 style={{ fontSize: "1rem", fontWeight: "700", letterSpacing: "1.5px", marginBottom: "2rem" }}>
              SHIPPING INFO
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {[
                { label: "Full Name", key: "fullName", type: "text" },
                { label: "Address", key: "address", type: "text" },
                { label: "City", key: "city", type: "text" },
                { label: "Phone Number", key: "phone", type: "tel" }
              ].map(field => (
                <input
                  key={field.key}
                  type={field.type}
                  placeholder={field.label}
                  name={field.key}
                  value={form[field.key]}
                  onChange={handleChange}
                  required
                  style={{
                    background: "#111",
                    border: "1px solid #222",
                    color: "#fff",
                    padding: "1rem",
                    fontSize: "0.9rem",
                    outline: "none",
                    width: "100%"
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ background: "#111", padding: "2rem", position: "sticky", top: "2rem", height: "fit-content" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: "700", letterSpacing: "1.5px", marginBottom: "2rem" }}>
              ORDER SUMMARY
            </h2>

            {cartItems.map((item, index) => (
              <div key={item._id || index} style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.85rem",
                color: "#999",
                marginBottom: "1rem"
              }}>
                <span>{item.name} x {item.qty}</span>
                <span>₦{(item.price * item.qty).toLocaleString()}</span>
              </div>
            ))}

            <div style={{
              borderTop: "1px solid #222",
              paddingTop: "1rem",
              marginTop: "1rem",
              marginBottom: "2rem",
              display: "flex",
              justifyContent: "space-between",
              fontSize: "1.1rem",
              fontWeight: "700"
            }}>
              <span>TOTAL</span>
              <span>₦{totalPrice.toLocaleString()}</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                background: "#FF0000",
                color: "#fff",
                border: "none",
                padding: "1.25rem",
                fontSize: "0.85rem",
                fontWeight: "700",
                letterSpacing: "1.5px",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? <ClipLoader color="#fff" size={20} /> : `PAY NOW - ₦${totalPrice.toLocaleString()}`}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default Checkout;