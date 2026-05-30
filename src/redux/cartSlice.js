import { createSlice } from "@reduxjs/toolkit";

const getUserShippingKey = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?._id ? `shippingAddress_${user._id}` : "shippingAddress_guest";
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [],
    shippingAddress: localStorage.getItem(getUserShippingKey()) 
      ? JSON.parse(localStorage.getItem(getUserShippingKey())) 
      : {},
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find(x => x._id === item._id);
      
      if (existItem) {
        state.cartItems = state.cartItems.map(x => 
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems.push(item);
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(x => x._id !== action.payload);
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    updateQty: (state, action) => {
      const { id, qty } = action.payload;
      state.cartItems = state.cartItems.map(item => 
        item._id === id ? { ...item, qty } : item
      );
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cartItems");
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem(getUserShippingKey(), JSON.stringify(state.shippingAddress));
    },
    resetCart: (state) => {
      state.cartItems = [];
      state.shippingAddress = {};
      localStorage.removeItem("cartItems");
      // Don't remove shipping here - keep per user
    },
  },
});

export const { addToCart, removeFromCart, updateQty, clearCart, saveShippingAddress, resetCart } = cartSlice.actions;
export default cartSlice.reducer;