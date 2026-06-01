import { createSlice } from "@reduxjs/toolkit";

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

    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem(SHIPPING_KEY, JSON.stringify(action.payload));
    },

    clearCart: (state) => {
      console.log("CLEARING CART NOW");
      state.cartItems = [];
      state.shippingAddress = {};

      // Remove ALL cart-related keys to be sure
      localStorage.removeItem(CART_KEY);
      localStorage.removeItem(SHIPPING_KEY);

      // Nuclear option: remove anything with cart/shipping
      Object.keys(localStorage).forEach(key => {
        if (key.includes("cart") || key.includes("shipping")) {
          localStorage.removeItem(key);
        }
      });

      console.log("CART CLEARED:", localStorage.getItem(CART_KEY));
    },

    resetCart: (state) => {
      state.cartItems = [];
      state.shippingAddress = {};
      localStorage.removeItem(CART_KEY);
      localStorage.removeItem(SHIPPING_KEY);
    },
  },
});

export const { addToCart, removeFromCart, saveShippingAddress, clearCart, resetCart } = cartSlice.actions;
export default cartSlice.reducer;