import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart } from "@/redux/cart.slice";

export default function useClearCartOnPayment() {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      location.pathname === "/payment-status" &&
      location.search.includes("status=Completed")
    ) {
      dispatch(clearCart());
    }
  }, [location, dispatch]);
}
