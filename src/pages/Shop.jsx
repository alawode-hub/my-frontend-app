import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { addToCart } from "../redux/cartSlice";
import { ClipLoader } from "react-spinners";
import toast, { Toaster } from "react-hot-toast";

// Make sure this matches your Vercel env var: VITE_API_URL
const API_URL = import.meta.env.VITE_API_URL;

// Helper to make sure image URL is absolute
const getFullImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_URL}${url}`;
};

function Shop() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const categoryFromUrl = queryParams.get("category");
  const searchFromUrl = queryParams.get("search");

  const [activeCategory, setActiveCategory] = useState("ALL PRODUCTS");
  const [searchQuery, setSearchQuery] = useState(searchFromUrl || "");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const categories = ["ALL PRODUCTS", "TOPS", "JEANS", "CAPS", "SNEAKERS", "HOODIES", "SHORTJEANS"];

  // Set category from URL or state on first load
  useEffect(() => {
    if (location.state?.activeCategory) {
      setActiveCategory(location.state.activeCategory);
    } else if (categoryFromUrl) {
      const formatted = categoryFromUrl.toUpperCase().replace(/\s+/g, "");
      setActiveCategory(formatted);
    } else {
      setActiveCategory("ALL PRODUCTS");
    }
  }, [categoryFromUrl, location.state]);

  // Update URL when filters change
  useEffect(() => {
    const params = [];
    if (activeCategory !== "ALL PRODUCTS") params.push(`category=${activeCategory}`);
    if (searchQuery) params.push(`search=${searchQuery}`);
    
    const url = params.length > 0 ? `/shop?${params.join("&")}` : "/shop";
    navigate(url, { replace: true });
  }, [activeCategory, searchQuery, navigate]);

  // Fetch products from backend with filters
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        const params = new URLSearchParams();
        if (activeCategory !== "ALL PRODUCTS") params.append("category", activeCategory);
        if (searchQuery) params.append("search", searchQuery);

        const url = `${API_URL}/api/products${params.toString() ? `?${params.toString()}` : ""}`;
        const { data } = await axios.get(url);
        
        const normalized = data.map(p => ({
          ...p,
          image: getFullImageUrl(p.image),
          countInStock: Number(p.stock ?? p.countInStock ?? 0)
        }));
        
        setProducts(normalized);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("FAILED TO LOAD PRODUCTS");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [activeCategory, searchQuery]); // re-run when filters change

  const [addedItems, setAddedItems] = useState({})

  const handleAddToCart = (product) => {
    if (!user) {
      toast.error("PLEASE LOGIN FIRST");
      navigate("/login");
      return;
    }

    const cartProduct = {
      _id: product._id,
      name: product.name,
      price: Number(product.price) || 0,
      image: product.image,
      category: product.category,
      description: product.description,
      countInStock: Number(product.countInStock) || 0,
      qty: 1
    };

    dispatch(addToCart(cartProduct));
    setAddedItems(prev => ({...prev, [product._id]: true }))
    toast.success("ADDED TO CART");
    setTimeout(() => {
      setAddedItems(prev => ({...prev, [product._id]: false }))
    }, 1500)
  };

  if (loading) return (
    <div style={{ background: "#0a0a0a", color: "#fff", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh", flexDirection: "column", gap: "1rem" }}>
        <ClipLoader color="#FF0000" size={50} />
        <p style={{ color: "#666", fontSize: "0.9rem", letterSpacing: "1px" }}>LOADING PRODUCTS...</p>
      </div>
    </div>
  );

  return (
    <div style={{ background: "#0a0a0a", color: "#fff", minHeight: "100vh" }}>
      <Navbar />
      <Toaster position="top-center" duration={2500} />

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "3rem 2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "900", textAlign: "center", marginBottom: "0.5rem", letterSpacing: "2px" }}>
          THE COLLECTION
        </h1>
        <div style={{ width: "40px", height: "3px", background: "#FF0000", margin: "0 auto 2.5rem auto" }}></div>

        {/* SEARCH BAR WITH CLEAR BUTTON */}
        <div style={{ maxWidth: "500px", margin: "0 auto 2rem auto", position: "relative" }}>
          <input
            type="text"
            placeholder="SEARCH PRODUCTS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 40px 12px 16px",
              background: "#111",
              border: "1px solid #333",
              color: "#fff",
              fontSize: "14px",
              outline: "none",
              letterSpacing: "1px"
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                color: "#999",
                fontSize: "20px",
                cursor: "pointer",
                lineHeight: 1
              }}
            >
              ×
            </button>
          )}
        </div>

        <div className="filter-tabs">
          {categories.map(cat => (
            <CategoryTab key={cat} cat={cat} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
          ))}
        </div>

        <div className="product-grid">
          {products.length === 0 ? (
            <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "#666" }}>
              NO PRODUCTS FOUND FOR "{searchQuery || activeCategory}"
            </p>
          ) : (
            products.map(product => (
              <ProductCardReplit key={product._id} product={product} handleAddToCart={handleAddToCart} addedItems={addedItems} activeCategory={activeCategory} />
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

const CategoryTab = ({ cat, activeCategory, setActiveCategory }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isActive = activeCategory === cat;

  return (
    <button
      onClick={() => setActiveCategory(cat)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: "transparent",
        border: "none",
        color: "#fff",
        fontSize: "0.75rem",
        fontWeight: "700",
        letterSpacing: "1.5px",
        cursor: "pointer",
        paddingBottom: "6px",
        borderBottom: isActive || isHovered ? "2px solid #FF0000" : "2px solid transparent",
        transition: "all 0.2s",
        flexShrink: 0
      }}
    >
      {cat}
    </button>
  );
};

const ProductCardReplit = ({ product, handleAddToCart, addedItems, activeCategory }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="product-card" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div style={{ position: "relative", overflow: "hidden", aspectRatio: "3/4" }}>
        <Link to={`/product/${product._id}`} state={{ fromCategory: activeCategory }}>
          <img 
            src={product.image}
            alt={product.name} 
            style={{ 
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: isHovered ? "scale(1.05)" : "scale(1)",
              objectPosition: "center",
              transition: "transform 0.4s ease"
            }} 
            onError={(e) => e.target.style.display = 'none'}
          />
        </Link>

        <div
          onClick={(e) => { e.preventDefault(); handleAddToCart(product); }}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background: addedItems[product._id] ? "#16a34a" : "#FF0000",
            color: "#fff",
            padding: "1rem",
            textAlign: "center",
            fontSize: "0.7rem",
            fontWeight: "700",
            letterSpacing: "1.5px",
            transform: isHovered ? "translateY(0)" : "translateY(100%)",
            transition: "transform 0.3s ease",
            cursor: "pointer"
          }}
        >
          {addedItems[product._id] ? 'ADDED ✓' : 'ADD TO CART'}
        </div>
      </div>

      <div style={{ padding: "1rem" }}>
        <Link to={`/product/${product._id}`} state={{ fromCategory: activeCategory }} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 style={{ fontSize: "0.75rem", fontWeight: "600", marginBottom: "0.25rem", letterSpacing: "0.5px", textTransform: "uppercase" }}>
            {product.name}
          </h3>
        </Link>
        <p style={{ fontSize: "0.8rem", fontWeight: "700", color: "#999" }}>
          ₦{product.price.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default Shop;