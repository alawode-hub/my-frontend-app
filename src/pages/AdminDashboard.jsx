import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../services/api";
import { ClipLoader } from "react-spinners";

const API_URL = import.meta.env.VITE_API_URI;

function Admin() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [pendingProducts, setPendingProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("products");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [editingProduct, setEditingProduct] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    countInStock: "",
    category: ""
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role!== "admin") {
      navigate("/");
      return;
    }
    fetchData();
  }, [user, navigate]);

  useEffect(() => {
    if (activeTab === "pending") {
      fetchPendingProducts();
    }
  }, [activeTab]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const getFullImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${API_URL}${url}`;
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, ordersRes] = await Promise.all([
        API.get("/products"),
        API.get("/orders")
      ]);

      const fixedProducts = productsRes.data.map(p => ({
       ...p,
        image: getFullImageUrl(p.image)
      }));

      setProducts(fixedProducts);
      setOrders(ordersRes.data);
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: 'FAILED TO LOAD DATA' });
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/products/pending");
      const fixedPending = res.data.map(p => ({
       ...p,
        image: getFullImageUrl(p.image)
      }));
      setPendingProducts(fixedPending);
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: 'FAILED TO LOAD PENDING' });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, status) => {
    try {
      await API.put(`/products/${id}/approve`, { status });
      setToast({ type: 'success', message: `PRODUCT ${status.toUpperCase()}` });
      fetchPendingProducts();
      if (status === 'approved') fetchData();
    } catch (err) {
      setToast({ type: 'error', message: 'ERROR' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({...form, [name]: value });
    if (errors[name]) {
      setErrors({...errors, [name]: "" });
    }
  };

  const parsePrice = (priceString) => {
    if (!priceString) return 0;
    let cleaned = priceString.toString().toLowerCase().replace(/[$,\s]/g, '');
    if (cleaned.includes('k')) {
      cleaned = cleaned.replace('k', '');
      return Number(cleaned) * 1000;
    }
    return Number(cleaned);
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const { data } = await API.post('/upload', formData);
      const imageUrl = data.startsWith('http')? data : `${API_URL}${data}`;
      setForm({...form, image: imageUrl });
      setUploading(false);
    } catch (error) {
      console.log(error);
      setToast({ type: 'error', message: 'IMAGE UPLOAD FAILED' });
      setUploading(false);
      e.target.value = "";
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Required";
    if (!form.price) newErrors.price = "Required";
    if (!form.countInStock) newErrors.countInStock = "Required";
    if (!form.category) newErrors.category = "Required";
    if (!form.image) newErrors.image = "Upload image";
    if (!form.description.trim()) newErrors.description = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setForm({
      name: "",
      price: "",
      image: "",
      description: "",
      countInStock: "",
      category: ""
    });
    setErrors({});
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product._id);
    setForm({
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description,
      countInStock: product.countInStock,
      category: product.category || ""
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setToast({ type: 'error', message: 'FIX ERRORS' });
      return;
    }

    setSubmitting(true);

    try {
      const productData = {
       ...form,
        price: parsePrice(form.price),
        countInStock: Number(form.countInStock)
      };

      if (editingProduct) {
        await API.put(`/products/${editingProduct}`, productData);
        setToast({ type: 'success', message: 'PRODUCT UPDATED' });
      } else {
        await API.post("/products", productData);
        setToast({ type: 'success', message: 'PRODUCT ADDED' });
      }

      closeModal();
      fetchData();
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || "ERROR" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    const product = products.find(p => p._id === id);
    setConfirmAction({
      type: 'delete',
      id: id,
      name: product?.name
    });
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`/products/${confirmAction.id}`);
      setConfirmAction(null);
      setToast({ type: 'success', message: 'PRODUCT DELETED' });
      fetchData();
    } catch (err) {
      setToast({ type: 'error', message: 'ERROR DELETING' });
      setConfirmAction(null);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div style={{ padding: "4rem", textAlign: "center" }}>
      <ClipLoader size={50} color="#FF0000" />
    </div>
  );

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '2rem' }}>ADMIN DASHBOARD</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: '#111', border: '1px solid #333', padding: '1.5rem', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '2rem', margin: 0 }}>{products.length}</h3>
            <p style={{ color: '#777' }}>TOTAL PRODUCTS</p>
          </div>
          <div style={{ background: '#111', border: '1px solid #333', padding: '1.5rem', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '2rem', margin: 0 }}>{pendingProducts.length}</h3>
            <p style={{ color: '#777' }}>PENDING APPROVAL</p>
          </div>
          <div style={{ background: '#111', border: '1px solid #333', padding: '1.5rem', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '2rem', margin: 0 }}>{orders.length}</h3>
            <p style={{ color: '#777' }}>TOTAL ORDERS</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #333' }}>
          <button onClick={() => setActiveTab("products")}
            style={{
              background: activeTab === "products"? '#fff' : 'transparent',
              color: activeTab === "products"? '#000' : '#fff', border: 'none', padding: '12px 24px',
              fontWeight: '700', cursor: 'pointer'
            }}>
            PRODUCTS
          </button>
          <button onClick={() => setActiveTab("pending")}
            style={{
              background: activeTab === "pending"? '#fff' : 'transparent',
              color: activeTab === "pending"? '#000' : '#fff', border: 'none', padding: '12px 24px',
              fontWeight: '700', cursor: 'pointer'
            }}>
            PENDING APPROVALS
          </button>
          <button onClick={() => setActiveTab("orders")}
            style={{
              background: activeTab === "orders"? '#fff' : 'transparent',
              color: activeTab === "orders"? '#000' : '#fff', border: 'none', padding: '12px 24px',
              fontWeight: '700', cursor: 'pointer'
            }}>
            ORDERS
          </button>
        </div>

        {activeTab === "products" && (
          <div style={{ background: '#111', border: '1px solid #333', padding: '2rem', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2>ALL PRODUCTS ({filteredProducts.length})</h2>
              <button onClick={openAddModal}
                style={{
                  background: '#fff', color: '#000', border: 'none', padding: '12px 24px',
                  fontWeight: '900', cursor: 'pointer'
                }}>
                + ADD PRODUCT
              </button>
            </div>

            <input type="text" placeholder="Search..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              style={{
                background: '#1a1a1a', border: '1px solid #333', padding: '12px',
                width: '100%', marginBottom: '1.5rem', color: '#fff', outline: 'none'
              }}
            />

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #333' }}>
                    <th style={{ textAlign: 'left', padding: '12px' }}>IMAGE</th>
                    <th style={{ textAlign: 'left', padding: '12px' }}>NAME</th>
                    <th style={{ textAlign: 'left', padding: '12px' }}>PRICE</th>
                    <th style={{ textAlign: 'left', padding: '12px' }}>CATEGORY</th>
                    <th style={{ textAlign: 'left', padding: '12px' }}>STOCK</th>
                    <th style={{ textAlign: 'left', padding: '12px' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product._id} style={{ borderBottom: '1px solid #222' }}>
                      <td style={{ padding: '12px' }}>
                        <img src={product.image} alt={product.name}
                          style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                      </td>
                      <td style={{ padding: '12px' }}>{product.name}</td>
                      <td style={{ padding: '12px' }}>₦{product.price.toLocaleString()}</td>
                      <td style={{ padding: '12px' }}>{product.category}</td>
                      <td style={{ padding: '12px' }}>{product.countInStock}</td>
                      <td style={{ padding: '12px' }}>
                        <button onClick={() => handleEdit(product)}
                          style={{
                            background: '#00ff00', color: '#000', border: 'none', padding: '8px 16px',
                            fontWeight: '700', cursor: 'pointer', marginRight: '5px'
                          }}>EDIT</button>
                        <button onClick={() => handleDelete(product._id)}
                          style={{
                            background: '#ff0000', color: '#fff', border: 'none', padding: '8px 16px',
                            fontWeight: '700', cursor: 'pointer'
                          }}>DELETE</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "pending" && (
          <div style={{ background: '#111', border: '1px solid #333', padding: '2rem', borderRadius: '8px' }}>
            <h2>PENDING PRODUCTS ({pendingProducts.length})</h2>

            {pendingProducts.length === 0? (
              <p style={{ color: '#666', marginTop: '2rem', textAlign: 'center' }}>NO PENDING PRODUCTS</p>
            ) : (
              <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #333' }}>
                      <th style={{ textAlign: 'left', padding: '12px' }}>IMAGE</th>
                      <th style={{ textAlign: 'left', padding: '12px' }}>NAME</th>
                      <th style={{ textAlign: 'left', padding: '12px' }}>PRICE</th>
                      <th style={{ textAlign: 'left', padding: '12px' }}>CATEGORY</th>
                      <th style={{ textAlign: 'left', padding: '12px' }}>SUBMITTED BY</th>
                      <th style={{ textAlign: 'left', padding: '12px' }}>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingProducts.map((product) => (
                      <tr key={product._id} style={{ borderBottom: '1px solid #222' }}>
                        <td style={{ padding: '12px' }}>
                          <img src={product.image} alt={product.name} style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                        </td>
                        <td style={{ padding: '12px' }}>{product.name}</td>
                        <td style={{ padding: '12px' }}>₦{product.price.toLocaleString()}</td>
                        <td style={{ padding: '12px' }}>{product.category}</td>
                        <td style={{ padding: '12px' }}>{product.submittedBy?.email || 'Unknown'}</td>
                        <td style={{ padding: '12px' }}>
                          <button onClick={() => handleApprove(product._id, 'approved')}
                            style={{
                              background: '#00ff00', color: '#000', border: 'none', padding: '8px 16px',
                              fontWeight: '700', cursor: 'pointer', marginRight: '5px'
                            }}>
                            APPROVE
                          </button>
                          <button onClick={() => handleApprove(product._id, 'rejected')}
                            style={{
                              background: '#ff0000', color: '#fff', border: 'none', padding: '8px 16px',
                              fontWeight: '700', cursor: 'pointer'
                            }}>
                            REJECT
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <div style={{ background: '#111', border: '1px solid #333', padding: '2rem', borderRadius: '8px' }}>
            <h2>ALL ORDERS ({orders.length})</h2>

            <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #333' }}>
                    <th style={{ textAlign: 'left', padding: '12px' }}>ORDER ID</th>
                    <th style={{ textAlign: 'left', padding: '12px' }}>CUSTOMER</th>
                    <th style={{ textAlign: 'left', padding: '12px' }}>EMAIL</th>
                    <th style={{ textAlign: 'left', padding: '12px' }}>TOTAL</th>
                    <th style={{ textAlign: 'left', padding: '12px' }}>ITEMS</th>
                    <th style={{ textAlign: 'left', padding: '12px' }}>STATUS</th>
                    <th style={{ textAlign: 'left', padding: '12px' }}>DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} style={{ borderBottom: '1px solid #222' }}>
                      <td style={{ padding: '12px' }}>#{order._id.slice(-6)}</td>
                      <td style={{ padding: '12px' }}>
                        {order.user?.firstName || order.shippingAddress?.fullName || "Guest"}
                        {order.user?.lastName? ` ${order.user.lastName}` : ""}
                      </td>
                      <td style={{ padding: '12px' }}>{order.user?.email || order.shippingAddress?.email || "-"}</td>
                      <td style={{ padding: '12px' }}>₦{order.totalPrice?.toLocaleString()}</td>
                      <td style={{ padding: '12px' }}>{order.orderItems?.length} items</td>
                      <td style={{ padding: '12px', color: order.isPaid? '#00ff00' : '#ffaa00', fontWeight: '700' }}>
                        {order.isPaid? 'Paid' : 'Processing'}
                      </td>
                      <td style={{ padding: '12px' }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 9998
        }}>
          <div style={{
            background: '#111', border: '2px solid #333', padding: '2rem',
            maxWidth: '600px', width: '100%'
          }}>
            <h2>{editingProduct? 'EDIT' : 'ADD'} PRODUCT</h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <input name="name" placeholder="Name" value={form.name} onChange={handleChange}
                style={{ background: '#1a1a1a', border: '1px solid #333', padding: '12px', color: '#fff' }} />

              <select name="category" value={form.category} onChange={handleChange}
                style={{ background: '#1a1a1a', border: '1px solid #333', padding: '12px', color: '#fff' }}>
                <option value="">Category</option>
                <option value="TOPS">TOPS</option>
                <option value="JEANS">JEANS</option>
                <option value="CAPS">CAPS</option>
                <option value="SNEAKERS">SNEAKERS</option>
              </select>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input name="price" placeholder="Price" value={form.price} onChange={handleChange}
                  style={{ background: '#1a1a1a', border: '1px solid #333', padding: '12px', color: '#fff' }} />
                <input name="countInStock" type="number" placeholder="Stock" value={form.countInStock}
                  onChange={handleChange} style={{ background: '#1a1a1a', border: '1px solid #333', padding: '12px', color: '#fff' }} />
              </div>

              <textarea name="description" placeholder="Description" value={form.description}
                onChange={handleChange} rows="3"
                style={{ background: '#1a1a1a', border: '1px solid #333', padding: '12px', color: '#fff' }} />

              <input type="file" onChange={uploadFileHandler} accept="image/*" />
              {uploading && <p>Uploading...</p>}
              {form.image && <img src={form.image} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />}

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" disabled={submitting || uploading}
                  style={{
                    background: '#fff', color: '#000', border: 'none', padding: '12px 24px',
                    fontWeight: '900', cursor: 'pointer', flex: 1
                  }}>
                  {submitting? 'SAVING...' : editingProduct? 'UPDATE' : 'ADD'}
                </button>
                <button type="button" onClick={closeModal}
                  style={{
                    background: 'transparent', color: '#fff', border: '1px solid #fff', padding: '12px 24px',
                    cursor: 'pointer'
                  }}>
                  CLOSE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmAction && confirmAction.type === 'delete' && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 9999
        }}>
          <div style={{
            background: '#000',
            border: '1px solid #fff',
            padding: '2rem',
            maxWidth: '350px',
            width: '100%',
            textAlign: 'center'
          }}>
            <p style={{ marginBottom: '2rem', fontSize: '16px', fontWeight: '600' }}>
              Remove "{confirmAction.name}" from products?
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={confirmDelete}
                style={{
                  background: '#fff',
                  color: '#000',
                  border: 'none',
                  padding: '12px 32px',
                  fontWeight: '900',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>
                YES
              </button>
              <button onClick={() => setConfirmAction(null)}
                style={{
                  background: '#000',
                  color: '#fff',
                  border: '1px solid #fff',
                  padding: '12px 32px',
                  cursor: 'pointer',
                  fontWeight: '900',
                  fontSize: '14px'
                }}>
                NO
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', zIndex: 10000,
          background: toast.type === 'success'? '#00ff00' : '#ff0000',
          color: '#000', padding: '16px 24px', fontWeight: '900',
          borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
        }}>
          {toast.message}
          <button onClick={() => setToast(null)} style={{
            marginLeft: '12px', background: 'transparent', border: 'none',
            fontWeight: '900', cursor: 'pointer', fontSize: '18px'
          }}>×</button>
        </div>
      )}

      <Footer />
    </div>
  );
}
export default Admin;