import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../redux/authSlice";
import { FaShoppingCart, FaBars, FaTimes, FaUser, FaPlus } from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const handleLogout = () => {
    dispatch(logoutUser());
    setMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav style={styles.nav}>
        {/* Hamburger */}
        <button style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>

        {/* Logo */}
        <Link to="/" onClick={closeMenu} style={styles.logo}>
          DripWithMK
        </Link>

        {/* Right Icons */}
        <div style={styles.rightIcons}>
          {user ? (
            <Link to="/profile" onClick={closeMenu} style={styles.iconLink}>
              <FaUser size={18} />
            </Link>
          ) : (
            <Link to="/login" onClick={closeMenu} style={styles.iconLink}>
              LOGIN
            </Link>
          )}

          <Link to="/cart" onClick={closeMenu} style={styles.iconLink}>
            <FaShoppingCart size={18} />
            {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
          </Link>
        </div>
      </nav>

      {/* Slide Drawer */}
      <div style={{...styles.drawer, transform: menuOpen ? "translateX(0)" : "translateX(-100%)"}}>
        <div style={styles.drawerHeader}>
          <h3 style={{margin: 0, fontSize: "18px", letterSpacing: "1px"}}>MENU</h3>
          <button onClick={closeMenu} style={styles.closeBtn}><FaTimes /></button>
        </div>

        <div style={styles.drawerLinks}>
          <Link to="/" onClick={closeMenu} style={navLinkStyle}>HOME</Link>
          <Link to="/shop" onClick={closeMenu} style={navLinkStyle}>SHOP</Link>
          
          {user && (
            <Link to="/sell-product" onClick={closeMenu} style={sellLinkStyle}>
              <FaPlus size={14} /> SELL PRODUCT
            </Link>
          )}

          {user ? (
            <>
              <Link to="/profile" onClick={closeMenu} style={navLinkStyle}>PROFILE</Link>
              <Link to="/orders" onClick={closeMenu} style={navLinkStyle}>MY ORDERS</Link>
              <button onClick={handleLogout} style={logoutBtnStyle}>LOGOUT</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu} style={navLinkStyle}>LOGIN</Link>
              <Link to="/register" onClick={closeMenu} style={navLinkStyle}>REGISTER</Link>
            </>
          )}
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && <div style={styles.overlay} onClick={closeMenu} />}
    </>
  );
};

const navLinkStyle = {
  color: "#fff",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: "500",
  letterSpacing: "1px",
  padding: "12px 0",
  borderBottom: "1px solid #1a1a1a",
  display: "block",
  textTransform: "uppercase"
};

const sellLinkStyle = {
  ...navLinkStyle,
  color: "#FF0000",
  fontWeight: "700",
  display: "flex",
  alignItems: "center",
  gap: "8px"
};

const logoutBtnStyle = {
  background: "transparent",
  border: "none",
  color: "#FF0000",
  fontSize: "14px",
  fontWeight: "500",
  letterSpacing: "1px",
  padding: "12px 0",
  textAlign: "left",
  cursor: "pointer",
  textTransform: "uppercase",
  borderBottom: "1px solid #1a1a1a"
};

const styles = {
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "56px",
    background: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    zIndex: 1000,
    borderBottom: "1px solid #1a1a1a"
  },
  hamburger: {
    background: "transparent",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    padding: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  logo: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "18px",
    fontWeight: "700",
    letterSpacing: "2px",
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)"
  },
  rightIcons: {
    display: "flex",
    alignItems: "center",
    gap: "16px"
  },
  iconLink: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "12px",
    fontWeight: "500",
    letterSpacing: "1px",
    position: "relative",
    display: "flex",
    alignItems: "center"
  },
  badge: {
    position: "absolute",
    top: "-6px",
    right: "-8px",
    background: "#FF0000",
    color: "#fff",
    borderRadius: "50%",
    width: "16px",
    height: "16px",
    fontSize: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700"
  },
  drawer: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "280px",
    height: "100vh",
    background: "#0a0a0a",
    zIndex: 1001,
    transition: "transform 0.3s ease",
    borderRight: "1px solid #1a1a1a"
  },
  drawerHeader: {
    height: "56px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    borderBottom: "1px solid #1a1a1a",
    color: "#fff"
  },
  closeBtn: {
    background: "transparent",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    padding: "8px",
    display: "flex"
  },
  drawerLinks: {
    padding: "16px 24px",
    display: "flex",
    flexDirection: "column",
    gap: "0"
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100vh",
    background: "rgba(0,0,0,0.7)",
    zIndex: 999
  }
};

export default Navbar;