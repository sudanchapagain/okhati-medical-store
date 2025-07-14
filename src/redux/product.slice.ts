import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "./store";

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  countInStock: number;
  rating?: number;
}

export const getAllProducts = createAsyncThunk<
  { recommended_products: Product[]; accuracy: number },
  void
>("product/getAllProducts", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("/api/product/recommendation/");
    const { recommended_products, accuracy } = response.data;
    return { recommended_products, accuracy };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data as string);
    }
    return rejectWithValue("Unknown error");
  }
});

export const filterProducts = createAsyncThunk<
  Product[],
  { searchKey: string; sortKey: string; category: string }
>(
  "product/filterProducts",
  async ({ searchKey, sortKey, category }, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/product/");
      let filteredProducts: Product[] = response.data;

      if (searchKey) {
        filteredProducts = response.data.filter((product: Product) => {
          return product.name.toLowerCase().includes(searchKey);
        });
      }

      if (sortKey !== "popular") {
        if (sortKey === "htl") {
          filteredProducts = response.data.sort((a: Product, b: Product) => {
            return -a.price + b.price;
          });
        } else {
          filteredProducts = response.data.sort((a: Product, b: Product) => {
            return a.price - b.price;
          });
        }
      }

      if (category !== "all") {
        filteredProducts = response.data.filter((product: Product) => {
          return product.category.toLowerCase().includes(category);
        });
      }

      return filteredProducts;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data as string);
      }
      return rejectWithValue("Unknown error");
    }
  },
);

export const addProductReview = createAsyncThunk<
  void,
  { review: { rating: number; comment: string }; productid: string }
>(
  "product/addProductReview",
  async ({ review, productid }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const currentUser = state.loginReducer.currentUser;

      if (!currentUser || !currentUser.jwtToken) {
        return rejectWithValue("User not authenticated");
      }

      const data = {
        rating: review.rating,
        comment: review.comment,
      };

      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + currentUser.jwtToken,
      };

      const response = await axios.post(
        `/api/review/create/${productid}/`,
        data,
        { headers },
      );

      if (response.status !== 200) {
        throw new Error("Error");
      }

      return;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Unknown error");
    }
  },
);

export const getProductById = createAsyncThunk<Product, string>(
  "product/getProductById",
  async (productid, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/product/${productid}/`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data as string);
      }
      return rejectWithValue("Unknown error");
    }
  },
);

export const deleteProduct = createAsyncThunk<void, string>(
  "product/deleteProduct",
  async (productid, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/product/${productid}/`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data as string);
      }
      return rejectWithValue("Unknown error");
    }
  },
);

export const addProduct = createAsyncThunk<Product, Product>(
  "product/addProduct",
  async (product, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/product/", product);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data as string);
      }
      return rejectWithValue("Unknown error");
    }
  },
);

export const updateProduct = createAsyncThunk<
  Product,
  { productid: string; updatedproduct: Partial<Product> }
>(
  "product/updateProduct",
  async ({ productid, updatedproduct }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `/api/product/${productid}/`,
        updatedproduct,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data as string);
      }
      return rejectWithValue("Unknown error");
    }
  },
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [] as Product[],
    product: {} as Product,
    accuracy: null as number | null,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.recommended_products;
        state.accuracy = action.payload.accuracy;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      })
      .addCase(filterProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(filterProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(filterProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      })
      .addCase(addProductReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProductReview.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addProductReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      })
      .addCase(getProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      })
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
        const index = state.products.findIndex(
          (p) => p.id === action.payload.id,
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      });
  },
});

export default productSlice.reducer;
