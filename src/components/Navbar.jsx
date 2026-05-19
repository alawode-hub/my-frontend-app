import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../redux/authSlice";
import { FaShoppingCart, FaBars, FaTimes, FaUser } from "react-icons/fa";

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
    navigate("/");
  };

  const closeMenu = () => setMenuOpen(false);

  const handleShopClick = (e) => {
    e.preventDefault();
    closeMenu();
    if (!user) {
      navigate('/login');
    } else {
      navigate('/shop');
    }
  };

  return (
    <>
      <nav style={{
        background: "#000",
        color: "#fff",
        height: "56px",
        width: "100%",
        maxWidth: "100vw",
        padding: "0 16px",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #1a1a1a",
        boxSizing: "border-box",
        overflowX: "hidden"
      }}>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: "transparent",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            padding: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
          }}
        >
          <FaBars size={18} />
        </button>

        {/* CENTER LOGO */}
        <Link
          to="/"
          onClick={closeMenu}
          style={{
            color: "#fff",
            textDecoration: "none",
            fontSize: "16px",
            fontWeight: "700",
            letterSpacing: "2px",
            textTransform: "uppercase",
            whiteSpace: "nowrap"
          }}
        >
          MK COLLECTIVES
        </Link>

        {/* RIGHT: Profile + Cart */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
          {user && (
            <Link
              to="/profile"
              onClick={closeMenu}
              style={{
                color: "#fff",
                textDecoration: "none",
                fontSize: "11px",
                fontWeight: "600",
                letterSpacing: "1px",
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px"
              }}
            >
              <FaUser size={14} />
              <span className="nav-username">HI, {user.name?.split(" ")[0].toUpperCase()}</span>
            </Link>
          )}

          <Link
            to="/cart"
            onClick={closeMenu}
            style={{
              color: "#fff",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "8px"
            }}
          >
            <FaShoppingCart size={18} />
            {cartCount > 0 && (
              <span style={{
                position: "absolute",
                top: "2px",
                right: "2px",
                background: "#FF0000",
                color: "#fff",
                borderRadius: "50%",
                minWidth: "16px",
                height: "16px",
                fontSize: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "700",
                padding: "0 4px"
              }}>
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* OVERLAY */}
      {menuOpen && (
        <div
          onClick={closeMenu}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 9998
          }}
        />
      )}

      {/* SLIDE DRAWER */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "280px",
        maxWidth: "80vw",
        background: "#000",
        zIndex: 10000,
        transform: menuOpen? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.25s ease",
        borderRight: "1px solid #1a1a1a",
        overflowY: "auto"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "16px"
        }}>
          <button
            onClick={closeMenu}
            style={{
              background: "transparent",
              border: "2px solid #FF0000",
              color: "#fff",
              cursor: "pointer",
              padding: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "32px",
              height: "32px"
            }}
          >
            <FaTimes size={14} />
          </button>
        </div>

        <div style={{
          padding: "0 32px",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          marginTop: "16px"
        }}>
          <Link to="/" onClick={closeMenu} style={navLinkStyle}>HOME</Link>
          <Link to="/shop" onClick={handleShopClick} style={navLinkStyle}>SHOP</Link>

          {user? (
            <>
              <Link to="/profile" onClick={closeMenu} style={navLinkStyle}>PROFILE</Link>
              {user.role === "admin" && (
                <Link to="/admin" onClick={closeMenu} style={navLinkStyle}>ADMIN</Link>
              )}
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
    </>
  );
};

const navLinkStyle = {
  color: "#fff",
  textDecoration: "none",
  fontSize: "13px",
  fontWeight: "400",
  textTransform: "uppercase",
  lineHeight: "1"
};

const logoutBtnStyle = {
  background: "transparent",
  border: "none",
  color: "#FF0000",
  textAlign: "left",
  fontSize: "13px",
  fontWeight: "400",
  textTransform: "uppercase",
  cursor: "pointer",
  padding: 0,
  lineHeight: "1"
};

export default Navbar;