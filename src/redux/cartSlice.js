import { createSlice } from "@reduxjs/toolkit";

// Use same key for all users to avoid ID mismatch after Paystack redirect
const CART_KEY = "cartItems";
const SHIPPING_KEY = "shippingAddress";

const getCartItems = () => {
  try {
    const items = localStorage.getItem(CART_KEY);
    return items? JSON.parse(items) : [];
  } catch {
    return [];
  }
};

const getShippingAddress = () => {
  try {
    const addr = localStorage.getItem(SHIPPING_KEY);
    return addr? JSON.parse(addr) : {};
  } catch {
    return {};
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: getCartItems(),
    shippingAddress: getShippingAddress(),
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id? item : x
        );
      } else {
        state.cartItems.push(item);
      }

      localStorage.setItem(CART_KEY, JSON.stringify(state.cartItems));
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id!== action.payload);
      localStorage.setItem(CART_KEY, JSON.stringify(state.cartItems));
    },

    updateQty: (state, action) => {
      const { id, qty } = action.payload;
      state.cartItems = state.cartItems.map((item) =>
        item._id === id? {...item, qty } : item
      );
      localStorage.setItem(CART_KEY, JSON.stringify(state.cartItems));
    },

    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem(SHIPPING_KEY, JSON.stringify(action.payload));
    },

      clearCart: (state) => {
  console.log("CLEARING CART NOW");
  state.cartItems = [];
  state.shippingAddress = {};

  // Wipe everything
  localStorage.clear();
  localStorage.setItem("cartItems", "[]");
  localStorage.setItem("shippingAddress", "{}");

  console.log("CART CLEARED:", localStorage.getItem("cartItems"));
},
    resetCart: (state) => {
      state.cartItems = [];
      state.shippingAddress = {};
      localStorage.removeItem(CART_KEY);
      localStorage.removeItem(SHIPPING_KEY);
    },
  },
});

export const { addToCart, removeFromCart, updateQty, saveShippingAddress, clearCart, resetCart } = cartSlice.actions;
export default cartSlice.reducer;