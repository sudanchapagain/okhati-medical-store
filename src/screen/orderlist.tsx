import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "@/components/ui/loader";
import { getAllOrders } from "@/redux/order.slice";
import type { RootState, AppDispatch } from "@/redux/store";
import {
  ShoppingBagIcon,
  UserIcon,
  CalendarIcon,
  CreditCardIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

interface Order {
  id: string;
  email: string;
  user_id: string;
  orderAmount: number;
  created_at: string;
  transactionId: string;
}

export default function Orderslist() {
  const navigate = useNavigate();
  const getordersstate = useSelector((state: RootState) => state.orderReducer);
  const { getAllOrdersLoading, getAllOrdersError, orders } =
    getordersstate as unknown as {
      getAllOrdersLoading: boolean;
      getAllOrdersError: boolean;
      orders: Order[];
    };
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  if (getAllOrdersLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader />
      </div>
    );
  }

  if (getAllOrdersError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="text-center">
          <ShoppingBagIcon className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Unable to load orders
          </h2>
          <p className="mb-4 text-gray-600">
            Something went wrong while fetching the orders.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded bg-gray-900 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="mb-2 flex items-center">
          <ShoppingBagIcon className="mr-2 h-6 w-6 text-gray-400" />
          <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
        </div>
        <p className="text-gray-600">Manage and view all customer orders</p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="hidden lg:block">
          <div className="grid grid-cols-7 gap-4 border-b border-gray-100 bg-gray-50 px-6 py-4">
            <div className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
              Order ID
            </div>
            <div className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
              Customer
            </div>
            <div className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
              User ID
            </div>
            <div className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
              Amount
            </div>
            <div className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
              Date
            </div>
            <div className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
              Transaction
            </div>
            <div className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
              Actions
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="grid grid-cols-7 gap-4 px-6 py-4 transition-colors hover:bg-gray-50"
                >
                  <div className="truncate font-mono text-sm text-gray-900">
                    {order.id}
                  </div>
                  <div className="flex items-center">
                    <UserIcon className="mr-2 h-4 w-4 text-gray-400" />
                    <span className="truncate text-sm text-gray-900">
                      {order.email}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700">{order.user_id}</div>
                  <div className="text-sm font-semibold text-green-600">
                    NPR {order.orderAmount.toFixed(2)}
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="mr-1 h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700">
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CreditCardIcon className="mr-1 h-4 w-4 text-gray-400" />
                    <span className="truncate font-mono text-xs text-gray-600">
                      {order.transactionId}
                    </span>
                  </div>
                  <div>
                    <button
                      onClick={() => navigate(`/orderinfo/${order.id}`)}
                      className="flex items-center text-sm text-gray-700 transition-colors hover:text-gray-900"
                    >
                      <EyeIcon className="mr-1 h-4 w-4" />
                      View
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center">
                <ShoppingBagIcon className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <p className="text-gray-600">No orders found</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:hidden">
          <div className="divide-y divide-gray-100">
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => navigate(`/orderinfo/${order.id}`)}
                  className="cursor-pointer p-4 transition-colors hover:bg-gray-50"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-1 flex items-center">
                        <ShoppingBagIcon className="mr-2 h-4 w-4 text-gray-400" />
                        <span className="text-xs tracking-wide text-gray-500 uppercase">
                          Order
                        </span>
                      </div>
                      <p className="truncate font-mono text-sm text-gray-900">
                        {order.id}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-green-600">
                        NPR {order.orderAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <UserIcon className="mr-2 h-4 w-4 text-gray-400" />
                      <span className="truncate text-gray-700">
                        {order.email}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CreditCardIcon className="mr-2 h-4 w-4 text-gray-400" />
                      <span className="truncate font-mono text-xs text-gray-600">
                        {order.transactionId}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-end">
                    <EyeIcon className="mr-1 h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">View Details</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <ShoppingBagIcon className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <p className="text-gray-600">No orders found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
