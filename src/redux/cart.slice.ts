import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface Product {
  name: string;
  id: string;
  price: number;
  countInStock: number;
}

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  cartItems: CartItem[];
}

const cartItems: CartItem[] = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems") as string)
  : [];

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: cartItems,
  } as CartState,
  reducers: {
    addItemToCart: (
      state,
      action: PayloadAction<{ product: Product; quantity: number }>,
    ) => {
      const { product, quantity } = action.payload;
      const { name, id, price, countInStock } = product;

      const existingItem = state.cartItems.find((item) => item.id === id);

      if (existingItem) {
        const newQuantity = Math.min(
          existingItem.quantity + quantity,
          countInStock,
        );
        existingItem.quantity = newQuantity;
        existingItem.countInStock = countInStock;
      } else {
        const validQuantity = Math.min(quantity, countInStock);
        if (validQuantity > 0) {
          state.cartItems.push({
            name,
            id,
            price,
            countInStock,
            quantity: validQuantity,
          });
        }
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    updateCartQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>,
    ) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find((item) => item.id === id);

      if (item) {
        item.quantity = Math.min(quantity, item.countInStock);
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    removeFromCart: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== id);

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    clearCart: (state) => {
      state.cartItems = [];
      localStorage.setItem("cartItems", JSON.stringify([]));
    },
  },
});

export const { addItemToCart, updateCartQuantity, removeFromCart, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
