import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
  isAdmin?: boolean;
  jwtToken: string;
}

export interface UpdateUserArgs {
  userid: string;
  updateUser: Partial<User>;
}

interface RegisterUserState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

interface LoginState {
  loading: boolean;
  success: boolean;
  error: string | null;
  currentUser: User | null;
}

interface UpdateState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

interface GetAllUsersState {
  loading: boolean;
  users: User[];
  error: string | null;
}

interface DeleteUserState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
  is_staff: boolean;
  is_active: boolean;
}

export const registerNewUser = createAsyncThunk<
  User,
  RegisterUserPayload,
  { rejectValue: string }
>("user/registerNewUser", async (user, { rejectWithValue }) => {
  try {
    const response = await axios.post("/api/users/", user);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ detail: string; message?: string }>;
    return rejectWithValue(
      err.response?.data?.detail ||
        err.response?.data?.message ||
        "Registration failed",
    );
  }
});

export const loginUser = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>("user/loginUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);

    console.log("Posting to", axios.defaults.baseURL + "/api/login");

    const response = await axios.post("/api/login/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    localStorage.setItem("currentUser", JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.detail || "Login failed");
    } else {
      return rejectWithValue("An unexpected error occurred");
    }
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "user/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("cartItems");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Logout failed");
    }
  },
);

export const updateUser = createAsyncThunk<
  User,
  UpdateUserArgs,
  { rejectValue: string }
>("user/updateUser", async ({ userid, updateUser }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`/api/users/${userid}/`, updateUser);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || "Update failed");
  }
});

export const getAllUsers = createAsyncThunk<
  User[],
  void,
  { rejectValue: string }
>("user/getAllUsers", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("/api/users/");
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || "Fetch users failed");
  }
});

export const deleteUser = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("user/deleteUser", async (userid, { rejectWithValue }) => {
  try {
    await axios.delete(`/api/users/${userid}/`);
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || "Delete failed");
  }
});

export const registerUserSlice = createSlice({
  name: "registerUser",
  initialState: {
    loading: false,
    success: false,
    error: null,
  } as RegisterUserState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerNewUser.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(registerNewUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(registerNewUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      });
  },
});

const currentUser: User | null = localStorage.getItem("currentUser")
  ? JSON.parse(localStorage.getItem("currentUser") as string)
  : null;

export const loginSlice = createSlice({
  name: "login",
  initialState: {
    loading: false,
    success: false,
    error: null,
    currentUser: currentUser,
  } as LoginState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.success = true;
        state.currentUser = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.currentUser = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      });
  },
});

export const updateSlice = createSlice({
  name: "update",
  initialState: { loading: false, success: false, error: null } as UpdateState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      });
  },
});

export const getAllUsersSlice = createSlice({
  name: "getAllUsers",
  initialState: { loading: false, users: [], error: null } as GetAllUsersState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.users = [];
        state.error = null;
      })
      .addCase(
        getAllUsers.fulfilled,
        (state, action: PayloadAction<User[]>) => {
          state.loading = false;
          state.users = action.payload;
        },
      )
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        const deletedUserId = action.meta.arg;
        state.users = state.users.filter(
          (user) => String(user.id) !== deletedUserId,
        );
      });
  },
});

export const deleteUserSlice = createSlice({
  name: "deleteUser",
  initialState: {
    loading: false,
    success: false,
    error: null,
  } as DeleteUserState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      });
  },
});

export default {
  registerUserSlice: registerUserSlice.reducer,
  loginSlice: loginSlice.reducer,
  updateSlice: updateSlice.reducer,
  getAllUsersSlice: getAllUsersSlice.reducer,
  deleteUserSlice: deleteUserSlice.reducer,
};
