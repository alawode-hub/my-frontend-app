import { createSlice } from "@reduxjs/toolkit";

const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
const shippingAddress = JSON.parse(localStorage.getItem("shippingAddress")) || {};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems,
    shippingAddress,
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);
      
      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id 
            ? { ...x, qty: Number(x.qty) + Number(item.qty) } 
            : x
        );
      } else {
        state.cartItems.push({ 
          ...item, 
          price: Number(item.price) || 0,
          qty: Number(item.qty) || 1 
        });
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    updateQty: (state, action) => {
      const { id, qty } = action.payload;
      state.cartItems = state.cartItems.map((x) =>
        x._id === id ? { ...x, qty: Number(qty) } : x
      );
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem("shippingAddress", JSON.stringify(action.payload));
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.shippingAddress = {};
      localStorage.removeItem("cartItems");
      localStorage.removeItem("shippingAddress");
    },
  },
});

export const { addToCart, removeFromCart, updateQty, saveShippingAddress, clearCart } = cartSlice.actions;
export default cartSlice.reducer;