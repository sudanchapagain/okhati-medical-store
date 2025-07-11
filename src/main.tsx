import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import store from "./redux/store.ts";
import Landing from "./screen/landing.tsx";
import Products from "./screen/products.tsx";
import ProductDetails from "./screen/productDetails.tsx";
import SignupPage from "./screen/signup.tsx";
import LoginPage from "./screen/login.tsx";
import OrderScreen from "./screen/order.tsx";
import OrderInfo from "./screen/orderInfo.tsx";
import ProfilePage from "./screen/profile.tsx";
import Checkout from "./screen/checkout.tsx";
import PaymentStatus from "./screen/paymentStatus.tsx";
import AdminScreen from "./screen/admin.tsx";
import UsersList from "./screen/userList.tsx";
import ProductList from "./screen/productList.tsx";
import AddProduct from "./screen/addProduct.tsx";
import EditProduct from "./screen/editProduct.tsx";
import Orderslist from "./screen/orderlist.tsx";
import NotFound from "./screen/not-found.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Landing />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {
        path: "/products/:id",
        element: <ProductDetails />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/orders",
        element: <OrderScreen />,
      },
      {
        path: "/orderinfo/:orderid",
        element: <OrderInfo />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path: "/checkout",
        element: <Checkout />,
      },
      {
        path: "/payment-status",
        element: <PaymentStatus />,
      },
      {
        path: "/admin",
        element: <AdminScreen />,
        children: [
          {
            index: true,
            element: <UsersList />,
          },
          {
            path: "productslist",
            element: <ProductList />,
          },
          {
            path: "userslist",
            element: <UsersList />,
          },
          {
            path: "addnewproduct",
            element: <AddProduct />,
          },
          {
            path: "editproduct/:id",
            element: <EditProduct />,
          },
          {
            path: "orderslist",
            element: <Orderslist />,
          },
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);