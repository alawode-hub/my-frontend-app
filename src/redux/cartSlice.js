import { createSlice } from "@reduxjs/toolkit";

const getUserId = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?._id || "guest";
};

const getUserShippingKey = () => `shippingAddress_${getUserId()}`;

const getCartItems = () => {
  try {
    const items = localStorage.getItem("cartItems");
    console.log("LOAD CART FROM LS:", items); // DEBUG
    return items ? JSON.parse(items) : [];
  } catch {
    return [];
  }
};

const getUserShipping = () => {
  try {
    const key = getUserShippingKey();
    const shipping = localStorage.getItem(key);
    console.log("LOAD SHIPPING FROM LS:", key, shipping); // DEBUG
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
      console.log("ADD TO CART:", state.cartItems); // DEBUG
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(x => x._id !== action.payload);
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      console.log("REMOVE FROM CART:", state.cartItems); // DEBUG
    },
    updateQty: (state, action) => {
      const { id, qty } = action.payload;
      state.cartItems = state.cartItems.map(item => 
        item._id === id ? { ...item, qty } : item
      );
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      console.log("UPDATE QTY:", state.cartItems); // DEBUG
    },
    clearCart: (state) => {
      console.log("CLEARCART CALLED - BEFORE:", state.cartItems); // DEBUG
      console.log("CLEARCART - USER ID:", getUserId()); // DEBUG
      console.log("CLEARCART - SHIPPING KEY:", getUserShippingKey()); // DEBUG
      
      state.cartItems = [];
      state.shippingAddress = {};
      
      localStorage.removeItem("cartItems");
      localStorage.removeItem(getUserShippingKey());
      
      console.log("CLEARCART CALLED - AFTER:", localStorage.getItem("cartItems")); // DEBUG
      console.log("CLEARCART - SHIPPING AFTER:", localStorage.getItem(getUserShippingKey())); // DEBUG
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem(getUserShippingKey(), JSON.stringify(state.shippingAddress));
      console.log("SAVE SHIPPING:", getUserShippingKey(), state.shippingAddress); // DEBUG
    },
    resetCart: (state) => {
      state.cartItems = [];
      state.shippingAddress = {};
      localStorage.removeItem("cartItems");
      localStorage.removeItem(getUserShippingKey());
      console.log("RESET CART CALLED"); // DEBUG
    },
  },
});

export const { addToCart, removeFromCart, updateQty, clearCart, saveShippingAddress, resetCart } = cartSlice.actions;
export default cartSlice.reducer;