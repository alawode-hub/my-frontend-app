import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference');

  return (
    <div style={{
      background: "#0a0a0a",
      color: "#fff",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "1.5rem",
      padding: "2rem",
      textAlign: "center"
    }}>
      <h2 style={{ fontSize: "2rem", fontWeight: "900", letterSpacing: "2px" }}>
        PAYMENT SUCCESSFUL ✅
      </h2>
      <p style={{ color: "#999", fontSize: "0.9rem" }}>Thank you for your purchase!</p>

      {reference && (
        <p style={{ color: "#666", fontSize: "0.8rem" }}>
          ORDER REF: {reference.slice(0, 8).toUpperCase()}
        </p>
      )}

      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <button
          onClick={() => navigate('/orders', { replace: true })}
          style={{
            background: "transparent",
            color: "#fff",
            border: "1px solid #333",
            padding: "1rem 2rem",
            fontSize: "0.85rem",
            fontWeight: "700",
            letterSpacing: "1.5px",
            cursor: "pointer"
          }}
        >
          VIEW ORDERS
        </button>
        <button
          onClick={() => navigate('/shop', { replace: true })}
          style={{
            background: "#FF0000",
            color: "#fff",
            border: "none",
            padding: "1rem 2rem",
            fontSize: "0.85rem",
            fontWeight: "700",
            letterSpacing: "1.5px",
            cursor: "pointer"
          }}
        >
          CONTINUE SHOPPING
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;