import axios from "axios";
import type { AppDispatch } from "./store";
import { logoutUser } from "./user.slice";

export const setupAxiosInterceptors = (dispatch: AppDispatch) => {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        dispatch(logoutUser());
        alert("Your session has expired. Please log in again.");
      }
      return Promise.reject(error);
    },
  );
};
