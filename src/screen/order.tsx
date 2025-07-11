import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "@/components/ui/loader";
import Error from "@/components/ui/error";
import { getOrdersByUserId } from "@/redux/order.slice";
import type { RootState, AppDispatch } from "@/redux/store";
import { CubeIcon } from "@heroicons/react/24/outline";

interface Order {
  id: string | number;
  _id: string;
  orderAmount: number;
  created_at: string;
  transactionId: string;
  isDelivered: boolean;
}

interface OrderState {
  orders: Order[] | null;
  getOrdersByUserIdError: boolean;
  getOrdersByUserIdLoading: boolean;
}

export default function OrderScreen() {
  const navigate = useNavigate();
  const orderState = useSelector(
    (state: RootState) => state.orderReducer as unknown as OrderState,
  );

  const { orders, getOrdersByUserIdError, getOrdersByUserIdLoading } =
    orderState;

  console.log("Order state:", {
    orders,
    getOrdersByUserIdError,
    getOrdersByUserIdLoading,
  });
  if (orders && orders.length > 0) {
    console.log("First order sample:", orders[0]);
    console.log("Order ID type:", typeof orders[0].id, orders[0].id);
  }

  const dispatch = useDispatch<AppDispatch>();

  const currentUser = useMemo(() => {
    const userString = localStorage.getItem("currentUser");
    return userString ? (JSON.parse(userString) as { id: string }) : null;
  }, []);

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(getOrdersByUserId(currentUser.id));
    } else {
      window.location.href = "/login";
    }
  }, [dispatch, currentUser?.id]);

  return (
    <div>
      <div className="mt-36 flex items-center justify-center px-4">
        <main className="mx-auto w-full max-w-7xl">
          <h2 className="mb-6 text-2xl font-semibold">Orders</h2>

          <div className="relative hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
              <thead className="bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Transaction ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {getOrdersByUserIdLoading && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center">
                      <Loader />
                    </td>
                  </tr>
                )}
                {!getOrdersByUserIdLoading && orders && orders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <CubeIcon className="mb-4 size-12 text-gray-500" />
                        <p className="text-lg font-medium">No orders yet</p>
                        <p className="mb-80 text-sm">
                          Your orders will appear here once you make a purchase
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
                {orders &&
                  orders.length > 0 &&
                  orders.map((order) => (
                    <tr
                      className="cursor-pointer border-b border-gray-200 transition-colors odd:bg-white even:bg-gray-50 hover:bg-gray-100 dark:border-gray-700 odd:dark:bg-gray-900 even:dark:bg-gray-800"
                      key={order.id}
                      onClick={() => navigate(`/orderinfo/${order.id}`)}
                    >
                      <td className="px-6 py-4 font-medium">
                        #{String(order.id || "").slice(-8)}
                      </td>
                      <td className="px-6 py-4 font-semibold text-green-600">
                        ${order.orderAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">
                        {order.transactionId}
                      </td>
                      <td className="px-6 py-4">
                        {order.isDelivered ? (
                          <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                            Delivered
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800">
                            Order Placed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-4 md:hidden">
            {getOrdersByUserIdLoading && (
              <div className="flex justify-center py-8">
                <Loader />
              </div>
            )}
            {!getOrdersByUserIdLoading && orders && orders.length === 0 && (
              <div className="py-16 text-center text-gray-500">
                <CubeIcon className="mx-auto mb-4 size-16 text-gray-500" />
                <p className="text-lg font-medium">No orders yet</p>
                <p className="text-sm">
                  Your orders will appear here once you make a purchase
                </p>
              </div>
            )}
            {orders &&
              orders.length > 0 &&
              orders.map((order) => (
                <div
                  key={order.id}
                  className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow transition-shadow hover:shadow-md"
                  onClick={() => navigate(`/orderinfo/${order._id}`)}
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Order #{String(order.id || "").slice(-8)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-green-600">
                        ${order.orderAmount.toFixed(2)}
                      </p>
                      {order.isDelivered ? (
                        <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                          Delivered
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800">
                          Order Placed
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-3">
                    <p className="text-xs text-gray-500">
                      <span className="font-medium">Transaction ID:</span>{" "}
                      {order.transactionId}
                    </p>
                  </div>
                </div>
              ))}
          </div>

          {getOrdersByUserIdError && (
            <div className="mt-4">
              <Error error="something went wrong" />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
