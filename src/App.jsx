import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Landing from "./pages/Landing";
import Shop from "./pages/Shop";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Admin from "./pages/AdminDashboard";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import "./index.css";
import ProtectedRoute from "./routes/ProtectedRoute";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Order from "./pages/Order";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentVerify from "./pages/PaymentVerify";

function App() {
  return (
    <Router>
      <Toaster 
        position="top-center" 
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#111',
            color: '#fff',
            border: '1px solid #333',
            fontWeight: '700',
            letterSpacing: '0.5px'
          },
          success: { 
            iconTheme: { primary: '#00ff00', secondary: '#000' },
            duration: 2000
          },
          error: { 
            iconTheme: { primary: '#ff0000', secondary: '#000' },
            duration: 3000
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/landing" element={<Landing />} />

        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />

        {/* PROTECTED ROUTES */}
        <Route path="/shop" element={<ProtectedRoute><Shop /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/order" element={<ProtectedRoute><Order /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />

        {/* PAYMENT ROUTES */}
        <Route path="/payment/verify" element={<PaymentVerify />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />

        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/admin" element={<ProtectedRoute adminOnly={true}><Admin /></ProtectedRoute>} />

        <Route path="*" element={<h1 style={{color: '#fff', textAlign: 'center', padding: '4rem'}}>404 - PAGE NOT FOUND</h1>} />
      </Routes>
    </Router>
  );
}

export default App;