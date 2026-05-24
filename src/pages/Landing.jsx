import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import toast, { Toaster } from "react-hot-toast";
import { Truck, Scissors, Tag } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URI;

function Landing() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/products`);

        const keywords = ["splatter", "timberland", "essentials", "cap"];
        let selected = data.filter(p =>
          keywords.some(k => p.name.toLowerCase().includes(k))
        ).slice(0, 4);

        if (selected.length < 4) {
          selected = data.slice(0, 4);
        }

        setFeaturedProducts(selected);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("FAILED TO LOAD PRODUCTS");
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleShopClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/shop');
    }
  };

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <Navbar />
      <Toaster position="top-center" duration={2500} />

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>
            ELEVATE YOUR <br />
            <span style={{ color: "#FF0000" }}>STREETWEAR STYLE</span>
          </h1>
          <p>
            CONFIDENT, REBELLIOUS, WITH A TOUCH OF LUXURY. FOR THE CITY KID WHO TREATS FITS LIKE A CRAFT.
          </p>
          <button onClick={handleShopClick} className="btn-white">
            GET STARTED
          </button>
        </div>
      </section>

      {/* LATEST DROPS */}
      <section style={{ padding: "6rem 5%", background: "#0a0a0a" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "3rem",
            flexWrap: "wrap",
            gap: "1rem"
          }}>
            <div>
              <h2 style={{ fontSize: "38px", fontWeight: "900", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "2px" }}>
                LATEST DROPS
              </h2>
              <p style={{ color: "#888", fontSize: "0.95rem", letterSpacing: "1.5px" }}>
                Curated fits for the season
              </p>
            </div>
            <button onClick={handleShopClick} className="btn-white" style={{ background: "transparent", border: "2px solid #fff", color: "#fff" }}>
              VIEW ALL
            </button>
          </div>

          {loading? (
            <div style={{ display: "flex", justifyContent: "center", padding: "4rem", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
              <ClipLoader color="#FF0000" size={40} />
              <p style={{ color: "#666" }}>LOADING PRODUCTS...</p>
            </div>
          ) : (
            <div className="product-grid">
              {featuredProducts.map(product => (
                <Link to={`/product/${product._id}`} key={product._id} style={{ textDecoration: "none" }}>
                  <div className="product-card">
                    <div className="product-img-wrapper">
                      <img
                        src={product.image.startsWith('http') ? product.image : `${API_URL}${product.image}`}
                        alt={product.name}
                        onError={(e) => { e.target.src = "https://via.placeholder.com/400x400/1a1a1a/FF0000?text=MK"; }}
                      />
                    </div>
                    <div style={{ padding: "1.2rem 1.5rem" }}>
                      <span style={{ fontSize: "0.88rem", color: "#fff", fontWeight: "500", display: "block", marginBottom: "0.5rem" }}>
                        {product.name}
                      </span>
                      <span style={{ fontSize: "1.15rem", fontWeight: "800", color: "#FF0000" }}>
                        ₦{Number(product.price).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section style={{ padding: "6rem 5%", background: "linear-gradient(180deg, #0a0a0a 0%, #000 100%)", textAlign: "center" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "38px", fontWeight: "900", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "2px" }}>
            WHY CHOOSE US
          </h2>
          <div style={{ width: "60px", height: "4px", background: "#FF0000", margin: "0 auto 4rem auto", borderRadius: "2px" }} />

          <div className="features-grid">

            <div className="feature-item">
              <div className="feature-icon">
                <Truck size={36} color="#fff" strokeWidth={2} />
              </div>
              <h3>FAST DELIVERY</h3>
              <p>Express shipping worldwide. Get your fits when you need them.</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <Scissors size={36} color="#fff" strokeWidth={2} />
              </div>
              <h3>QUALITY STREETWEAR</h3>
              <p>Premium heavyweight fabrics. Built to last the streets.</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <Tag size={36} color="#fff" strokeWidth={2} />
              </div>
              <h3>AFFORDABLE PRICING</h3>
              <p>Luxury aesthetics without the luxury markup.</p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Landing;