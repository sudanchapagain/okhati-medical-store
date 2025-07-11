import { configureStore } from "@reduxjs/toolkit";
import {
  registerUserSlice,
  loginSlice,
  updateSlice,
  getAllUsersSlice,
  deleteUserSlice,
} from "./user.slice";
import productSlice from "./product.slice";
import orderSlice from "./order.slice";
import cartSlice from "./cart.slice";
import { setupAxiosInterceptors } from "./axiosInterceptor";

const store = configureStore({
  reducer: {
    registerReducer: registerUserSlice.reducer,
    loginReducer: loginSlice.reducer,
    updateUserReducer: updateSlice.reducer,
    getAllUsersReducer: getAllUsersSlice.reducer,
    deleteUserReducer: deleteUserSlice.reducer,
    productReducer: productSlice,
    orderReducer: orderSlice,
    cartReducer: cartSlice,
  },
});

setupAxiosInterceptors(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
