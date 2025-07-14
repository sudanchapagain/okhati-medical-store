import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Header />}
      <Outlet />
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;
