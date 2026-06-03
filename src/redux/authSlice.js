import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URI;

// Get user + token from localStorage on app load
const userFromStorage = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
const tokenFromStorage = localStorage.getItem("token") || null;

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post(`${API_URL}/api/users/register`, userData, config);
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.token); // SAVE TOKEN
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post(`${API_URL}/api/users/login`, userData, config);
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.token); // SAVE TOKEN
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateProfile",
  async (userData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`, // use token from state
        },
      };
      const { data } = await axios.put(`${API_URL}/api/users/profile`, userData, config);
      localStorage.setItem("user", JSON.stringify(data)); // update user in storage
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async ({ currentPassword, newPassword }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      };
      const { data } = await axios.put(
        `${API_URL}/api/users/password`,
        { currentPassword, newPassword },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: userFromStorage,
    token: tokenFromStorage, // LOAD TOKEN
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    logoutUser: (state) => {
      localStorage.removeItem("user");
      localStorage.removeItem("token"); // CLEAR TOKEN
      localStorage.removeItem("cartItems");
      state.user = null;
      state.token = null;
      state.error = null;
      state.successMessage = null;
      window.location.href = "/login";
    },
    resetError: (state) => {
      state.error = null;
    },
    resetSuccess: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token; // SET TOKEN IN STATE
        state.successMessage = "REGISTRATION SUCCESSFUL";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token; // SET TOKEN IN STATE
        state.successMessage = "LOGIN SUCCESSFUL";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.successMessage = "PROFILE UPDATED";
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "PASSWORD CHANGED SUCCESSFULLY";
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutUser, resetError, resetSuccess } = authSlice.actions;
export default authSlice.reducer;