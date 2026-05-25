const handlePaystack = async () => {
  try {
    const { data } = await axios.post(
      `${API_URL}/api/payment/initialize`,
      {
        email: user.email,
        amount: totalPrice, // in Naira
        orderId: order._id,
        callback_url: `${window.location.origin}/payment/verify` // ADD THIS
      },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );

    window.location.href = data.data.authorization_url;
  } catch (err) {
    console.log(err.response?.data);
    toast.error("Payment initialization failed");
  }
};