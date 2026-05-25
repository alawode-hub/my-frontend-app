import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, clearCart, updateQty } from "../redux/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URI;

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const cartItems = useSelector((state) => state.cartItems);
  const { user } = useSelector((state) => state.auth);
  
  const [confirmAction, setConfirmAction] = useState(null);
  const [loading, setLoading] = useState(false);

  const getFullImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${API_URL}${url}`;
  };

  const handleRemove = (id) => {
    setConfirmAction({
      text: "Remove this item from cart?",
      onConfirm: () => {
        dispatch(removeFromCart(id));
        toast.success("ITEM REMOVED");
        setConfirmAction(null);
      }
    });
  };

  const handleClearCart = () => {
    setConfirmAction({
      text: "Clear your entire cart?",
      onConfirm: () => {
        dispatch(clearCart());
        toast.success("CART CLEARED");
        setConfirmAction(null);
      }
    });
  };

  const handleUpdateQty = (id, qty) => {
    if (qty < 1) return;
    dispatch(updateQty({ id, qty: Number(qty) }));
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error("PLEASE LOGIN TO CHECKOUT");
      setTimeout(() => navigate("/login"), 1000);
      return;
    }
    setLoading(true);
    setTimeout(() => navigate("/checkout"), 300);
  };

  const total = cartItems.reduce((acc, item) => acc + Number(item.price) * Number(item.qty), 0);

  return (
    <div style={{ background: "#0a0a0a", color: "#fff", minHeight: "100vh" }}>
      <Navbar />
      
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "4rem 2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "900", letterSpacing: "2px", marginBottom: "2rem" }}>
          YOUR CART ({cartItems.length})
        </h1>

        {confirmAction && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
            <div style={{ background: '#111', border: '2px solid #fff', padding: '30px', maxWidth: '400px', textAlign: 'center' }}>
              <p style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '25px' }}>{confirmAction.text}</p>
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                <button onClick={confirmAction.onConfirm} style={{ background: '#fff', color: '#000', border: 'none', padding: '12px 30px', fontWeight: '900', cursor: 'pointer' }}>YES</button>
                <button onClick={() => setConfirmAction(null)} style={{ background: 'transparent', color: '#fff', border: '2px solid #fff', padding: '12px 30px', fontWeight: '900', cursor: 'pointer' }}>NO</button>
              </div>
            </div>
          </div>
        )}

        {cartItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <p style={{ fontSize: "1.2rem", color: "#666", marginBottom: "2rem" }}>Your cart is empty</p>
            <Link to="/shop" style={{ background: "#FF0000", color: "#fff", padding: "1rem 2rem", textDecoration: "none", fontWeight: "700" }}>CONTINUE SHOPPING</Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
            <div>
              {cartItems.map((item) => (
                <div key={item._id} style={{ display: "flex", gap: "1rem", marginBottom: "2rem", borderBottom: "1px solid #222", paddingBottom: "2rem" }}>
                  <img 
                    src={getFullImageUrl(item.image)} 
                    alt={item.name} 
                    style={{ width: "80px", height: "100px", objectFit: "cover" }} 
                  />
                  <div style={{ flex: 1 }}>
                    <h3>{item.name}</h3>
                    <p style={{ color: "#999" }}>₦{Number(item.price).toLocaleString()}</p>
                    <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginTop: "1rem" }}>
                      <button onClick={() => handleUpdateQty(item._id, item.qty - 1)} disabled={item.qty <= 1}>-</button>
                      <span>{item.qty}</span>
                      <button onClick={() => handleUpdateQty(item._id, item.qty + 1)}>+</button>
                      <button onClick={() => handleRemove(item._id)} style={{ color: "#FF0000" }}>Remove</button>
                    </div>
                  </div>
                  <p style={{ fontWeight: "900" }}>₦{(item.qty * item.price).toLocaleString()}</p>
                </div>
              ))}
              <button onClick={handleClearCart} style={{ color: "#FF0000", background: "none", border: "none", cursor: "pointer" }}>CLEAR CART</button>
            </div>

            <div style={{ background: "#111", padding: "2rem", height: "fit-content" }}>
              <h2>ORDER SUMMARY</h2>
              <div style={{ display: "flex", justifyContent: "space-between", margin: "1rem 0" }}>
                <span>Total</span>
                <span>₦{total.toLocaleString()}</span>
              </div>
              <button onClick={handleCheckout} disabled={loading} style={{ width: "100%", background: "#FF0000", color: "#fff", padding: "1rem", border: "none", cursor: "pointer" }}>
                {loading ? <ClipLoader size={20} color="#fff" /> : "CHECKOUT"}
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;