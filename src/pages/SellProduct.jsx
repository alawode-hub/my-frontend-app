import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../services/api";
import { ClipLoader } from "react-spinners";
import toast, { Toaster } from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URI;

function SellProduct() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    countInStock: "",
    category: "",
    size: "",
    color: ""
  });

  const [errors, setErrors] = useState({});

  if (!user) {
    navigate("/login");
    return null;
  }

  const getFullImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${API_URL}${url}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({...form, [name]: value });
    if (errors[name]) {
      setErrors({...errors, [name]: "" });
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const { data } = await API.post('/upload', formData);
      const imageUrl = data.startsWith('http')? data : data;
      setForm({...form, image: imageUrl });
      setUploading(false);
      toast.success("IMAGE UPLOADED");
    } catch (error) {
      console.log(error);
      toast.error("IMAGE UPLOAD FAILED");
      setUploading(false);
      e.target.value = "";
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "REQUIRED";
    if (!form.price) newErrors.price = "REQUIRED";
    if (!form.countInStock) newErrors.countInStock = "REQUIRED";
    if (!form.category) newErrors.category = "REQUIRED";
    if (!form.image) newErrors.image = "UPLOAD IMAGE";
    if (!form.description.trim()) newErrors.description = "REQUIRED";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("FIX ERRORS FIRST");
      return;
    }

    setSubmitting(true);

    try {
      const productData = {
        name: form.name,
        price: Number(form.price),
        countInStock: Number(form.countInStock),
        category: form.category,
        image: form.image,
        description: form.description,
        size: form.size? form.size.split(',').map(s => s.trim()) : [],
        color: form.color? form.color.split(',').map(c => c.trim()) : []
      };

      await API.post("/products/submit", productData);
      toast.success("PRODUCT SUBMITTED! WAITING FOR ADMIN APPROVAL");

      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "SUBMISSION FAILED");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ background: "#0a0a0a", color: "#fff", minHeight: "100vh" }}>
      <Navbar />
      <Toaster position="top-center" duration={2500} />

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "3rem 2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "900", textAlign: "center", marginBottom: "0.5rem", letterSpacing: "2px" }}>
          SELL YOUR PRODUCT
        </h1>
        <div style={{ width: "40px", height: "3px", background: "#FF0000", margin: "0 auto 2.5rem auto" }}></div>

        <div style={{ background: "#111", border: "1px solid #333", padding: "2rem", borderRadius: "8px" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            <div>
              <input
                name="name"
                placeholder="PRODUCT NAME"
                value={form.name}
                onChange={handleChange}
                style={{
                  width: "100%",
                  background: "#1a1a1a",
                  border: errors.name? "1px solid #ff0000" : "1px solid #333",
                  padding: "12px",
                  color: "#fff",
                  outline: "none",
                  fontSize: "14px",
                  letterSpacing: "1px"
                }}
              />
              {errors.name && <p style={{ color: "#ff0000", fontSize: "12px", marginTop: "5px" }}>{errors.name}</p>}
            </div>

            <div>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                style={{
                  width: "100%",
                  background: "#1a1a1a",
                  border: errors.category? "1px solid #ff0000" : "1px solid #333",
                  padding: "12px",
                  color: "#fff",
                  outline: "none",
                  fontSize: "14px",
                  letterSpacing: "1px"
                }}>
                <option value="">SELECT CATEGORY</option>
                <option value="TOPS">TOPS</option>
                <option value="JEANS">JEANS</option>
                <option value="CAPS">CAPS</option>
                <option value="SNEAKERS">SNEAKERS</option>
                <option value="HOODIES">HOODIES</option>
                <option value="SHORT JEANS">SHORT JEANS</option>
              </select>
              {errors.category && <p style={{ color: "#ff0000", fontSize: "12px", marginTop: "5px" }}>{errors.category}</p>}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <input
                  name="price"
                  type="number"
                  placeholder="PRICE (₦)"
                  value={form.price}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    background: "#1a1a1a",
                    border: errors.price? "1px solid #ff0000" : "1px solid #333",
                    padding: "12px",
                    color: "#fff",
                    outline: "none",
                    fontSize: "14px"
                  }}
                />
                {errors.price && <p style={{ color: "#ff0000", fontSize: "12px", marginTop: "5px" }}>{errors.price}</p>}
              </div>

              <div>
                <input
                  name="countInStock"
                  type="number"
                  placeholder="STOCK QTY"
                  value={form.countInStock}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    background: "#1a1a1a",
                    border: errors.countInStock? "1px solid #ff0000" : "1px solid #333",
                    padding: "12px",
                    color: "#fff",
                    outline: "none",
                    fontSize: "14px"
                  }}
                />
                {errors.countInStock && <p style={{ color: "#ff0000", fontSize: "12px", marginTop: "5px" }}>{errors.countInStock}</p>}
              </div>
            </div>

            <div>
              <textarea
                name="description"
                placeholder="PRODUCT DESCRIPTION"
                value={form.description}
                onChange={handleChange}
                rows="4"
                style={{
                  width: "100%",
                  background: "#1a1a1a",
                  border: errors.description? "1px solid #ff0000" : "1px solid #333",
                  padding: "12px",
                  color: "#fff",
                  outline: "none",
                  fontSize: "14px",
                  resize: "none"
                }}
              />
              {errors.description && <p style={{ color: "#ff0000", fontSize: "12px", marginTop: "5px" }}>{errors.description}</p>}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <input
                name="size"
                placeholder="SIZES (S,M,L,XL) - optional"
                value={form.size}
                onChange={handleChange}
                style={{
                  background: "#1a1a1a",
                  border: "1px solid #333",
                  padding: "12px",
                  color: "#fff",
                  outline: "none",
                  fontSize: "14px"
                }}
              />
              <input
                name="color"
                placeholder="COLORS (Black,White) - optional"
                value={form.color}
                onChange={handleChange}
                style={{
                  background: "#1a1a1a",
                  border: "1px solid #333",
                  padding: "12px",
                  color: "#fff",
                  outline: "none",
                  fontSize: "14px"
                }}
              />
            </div>

            <div>
              <input
                type="file"
                onChange={uploadFileHandler}
                accept="image/*"
                style={{
                  width: "100%",
                  background: "#1a1a1a",
                  border: errors.image? "1px solid #ff0000" : "1px solid #333",
                  padding: "12px",
                  color: "#fff"
                }}
              />
              {uploading && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
                  <ClipLoader size={20} color="#FF0000" />
                  <p style={{ color: "#999", fontSize: "12px" }}>UPLOADING...</p>
                </div>
              )}
              {errors.image && <p style={{ color: "#ff0000", fontSize: "12px", marginTop: "5px" }}>{errors.image}</p>}
              {form.image &&!uploading && (
                <img
                  src={getFullImageUrl(form.image)}
                  alt="preview"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    marginTop: "10px",
                    border: "1px solid #333"
                  }}
                />
              )}
            </div>

            <button
              type="submit"
              disabled={submitting || uploading}
              style={{
                background: submitting? "#333" : "#FF0000",
                color: "#fff",
                border: "none",
                padding: "14px",
                fontWeight: "900",
                cursor: submitting? "not-allowed" : "pointer",
                fontSize: "14px",
                letterSpacing: "1.5px",
                marginTop: "1rem"
              }}>
              {submitting? "SUBMITTING..." : "SUBMIT FOR APPROVAL"}
            </button>

            <p style={{ color: "#666", fontSize: "12px", textAlign: "center", marginTop: "1rem" }}>
              * YOUR PRODUCT WILL BE REVIEWED BY ADMIN BEFORE IT SHOWS IN SHOP
            </p>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default SellProduct;