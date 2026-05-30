import { createSlice } from "@reduxjs/toolkit";

const getUserId = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?._id || "guest";
};

const getUserShippingKey = () => `shippingAddress_${getUserId()}`;

const getCartItems = () => {
  try {
    const items = localStorage.getItem("cartItems");
    return items ? JSON.parse(items) : [];
  } catch {
    return [];
  }
};

const getUserShipping = () => {
  try {
    const shipping = localStorage.getItem(getUserShippingKey());
    return shipping ? JSON.parse(shipping) : {};
  } catch {
    return {};
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: getCartItems(),
    shippingAddress: getUserShipping(),
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
      state.shippingAddress = {};
      localStorage.removeItem("cartItems");
      localStorage.removeItem(getUserShippingKey()); // Clear current user shipping
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem(getUserShippingKey(), JSON.stringify(state.shippingAddress));
    },
    resetCart: (state) => {
      state.cartItems = [];
      state.shippingAddress = {};
      localStorage.removeItem("cartItems");
      localStorage.removeItem(getUserShippingKey());
    },
  },
});

export const { addToCart, removeFromCart, updateQty, clearCart, saveShippingAddress, resetCart } = cartSlice.actions;
export default cartSlice.reducer;