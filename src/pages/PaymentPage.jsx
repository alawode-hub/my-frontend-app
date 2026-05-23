const handlePaystack = async () => {
  try {
    const { data } = await axios.post(
      `${API_URL}/api/payment/initialize`,
      {
        email: user.email,
        amount: totalPrice, // in Naira
        orderId: order._id
      },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );

    // Redirect user to Paystack payment page
    window.location.href = data.data.authorization_url;
  } catch (err) {
    toast.error("Payment initialization failed");
  }
};