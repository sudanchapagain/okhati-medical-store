import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Landing from "./screen/landing";
import ProductDetails from "./screen/productDetails";
import NotFound from "./screen/not-found";
import Header from "./components/header";
import Footer from "./components/footer";
import Products from "./screen/products";
import SignupPage from "./screen/signup";
import LoginPage from "./screen/login";
import ProfilePage from "./screen/profile";
import AdminScreen from "./screen/admin";
import OrderScreen from "./screen/order";
import OrderInfo from "./screen/orderInfo";
import Orderslist from "./screen/orderlist";
import UsersList from "./screen/userList";
import ProductList from "./screen/productList";
import AddProduct from "./screen/addProduct";
import EditProduct from "./screen/editProduct";
import Checkout from "./screen/checkout";
import PaymentStatus from "./screen/paymentStatus";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Header />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />

        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/orders" element={<OrderScreen />} />
        <Route path="/orderinfo/:orderid" element={<OrderInfo />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment-status" element={<PaymentStatus />} />

        <Route path="/admin" element={<AdminScreen />}>
          <Route index element={<UsersList />} />
          <Route path="productslist" element={<ProductList />} />
          <Route path="userslist" element={<UsersList />} />
          <Route path="addnewproduct" element={<AddProduct />} />
          <Route path="editproduct/:id" element={<EditProduct />} />
          <Route path="orderslist" element={<Orderslist />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
