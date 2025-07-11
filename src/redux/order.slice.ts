import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Order {
  id: string;
  [key: string]: unknown;
}

interface OrderState {
  placeOrderLoading: boolean;
  placeOrderSuccess: boolean;
  placeOrderError: boolean;
  getOrdersByUserIdLoading: boolean;
  getOrdersByUserIdError: boolean;
  getOrderByIdLoading: boolean;
  getOrderByIdError: boolean;
  getAllOrdersLoading: boolean;
  getAllOrdersError: boolean;
  orders: Order[];
  order: Order | null;
}

type OrderData = Record<string, unknown>;

export const placeOrder = createAsyncThunk<Order, OrderData>(
  "order/placeOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "null",
      );

      if (!currentUser || !currentUser.jwtToken) {
        return rejectWithValue("User not authenticated");
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + currentUser.jwtToken,
      };

      const response = await axios.post("/api/order", orderData, { headers });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || "Failed to place order");
      }
      return rejectWithValue("Failed to place order");
    }
  },
);

export const getOrdersByUserId = createAsyncThunk<Order[], string>(
  "order/getOrdersByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "null",
      );

      if (!currentUser || !currentUser.jwtToken) {
        return rejectWithValue("User not authenticated");
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + currentUser.jwtToken,
      };

      const response = await axios.get(`/api/order/orderbyuser/${userId}`, {
        headers,
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data || "Failed to fetch orders",
        );
      }
      return rejectWithValue("Failed to fetch orders");
    }
  },
);

export const getOrderById = createAsyncThunk<Order, string>(
  "order/getOrderById",
  async (orderId, { rejectWithValue }) => {
    try {
      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "null",
      );

      if (!currentUser || !currentUser.jwtToken) {
        return rejectWithValue("User not authenticated");
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + currentUser.jwtToken,
      };

      const response = await axios.get(`/api/order/orderbyid/${orderId}`, {
        headers,
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || "Failed to fetch order");
      }
      return rejectWithValue("Failed to fetch order");
    }
  },
);

export const getAllOrders = createAsyncThunk<Order[]>(
  "order/getAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "null",
      );

      if (!currentUser || !currentUser.jwtToken) {
        return rejectWithValue("User not authenticated");
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + currentUser.jwtToken,
      };

      const response = await axios.get("/api/order/", { headers });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data || "Failed to fetch all orders",
        );
      }
      return rejectWithValue("Failed to fetch all orders");
    }
  },
);

const initialState: OrderState = {
  placeOrderLoading: false,
  placeOrderSuccess: false,
  placeOrderError: false,
  getOrdersByUserIdLoading: false,
  getOrdersByUserIdError: false,
  getOrderByIdLoading: false,
  getOrderByIdError: false,
  getAllOrdersLoading: false,
  getAllOrdersError: false,
  orders: [],
  order: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.placeOrderLoading = true;
        state.placeOrderSuccess = false;
        state.placeOrderError = false;
      })
      .addCase(placeOrder.fulfilled, (state) => {
        state.placeOrderLoading = false;
        state.placeOrderSuccess = true;
        state.placeOrderError = false;
      })
      .addCase(placeOrder.rejected, (state) => {
        state.placeOrderLoading = false;
        state.placeOrderSuccess = false;
        state.placeOrderError = true;
      })
      .addCase(getOrdersByUserId.pending, (state) => {
        state.getOrdersByUserIdLoading = true;
        state.getOrdersByUserIdError = false;
      })
      .addCase(
        getOrdersByUserId.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.getOrdersByUserIdLoading = false;
          state.getOrdersByUserIdError = false;
          state.orders = action.payload;
        },
      )
      .addCase(getOrdersByUserId.rejected, (state) => {
        state.getOrdersByUserIdLoading = false;
        state.getOrdersByUserIdError = true;
      })
      .addCase(getOrderById.pending, (state) => {
        state.getOrderByIdLoading = true;
        state.getOrderByIdError = false;
      })
      .addCase(
        getOrderById.fulfilled,
        (state, action: PayloadAction<Order>) => {
          state.getOrderByIdLoading = false;
          state.getOrderByIdError = false;
          state.order = action.payload;
        },
      )
      .addCase(getOrderById.rejected, (state) => {
        state.getOrderByIdLoading = false;
        state.getOrderByIdError = true;
      })
      .addCase(getAllOrders.pending, (state) => {
        state.getAllOrdersLoading = true;
        state.getAllOrdersError = false;
      })
      .addCase(
        getAllOrders.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.getAllOrdersLoading = false;
          state.getAllOrdersError = false;
          state.orders = action.payload;
        },
      )
      .addCase(getAllOrders.rejected, (state) => {
        state.getAllOrdersLoading = false;
        state.getAllOrdersError = true;
      });
  },
});

export default orderSlice.reducer;
