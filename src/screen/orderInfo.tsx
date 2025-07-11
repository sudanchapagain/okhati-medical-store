import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "@/components/ui/loader";
import { getOrderById } from "@/redux/order.slice";
import type { RootState, AppDispatch } from "@/redux/store";
import {
  ShoppingBagIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

interface OrderItem {
  _id: string;
  name: string;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  address: string;
  city: string;
  country: string;
}

interface Order {
  _id: string;
  orderItems: OrderItem[];
  orderAmount: number;
  created_at: string;
  transactionId: string;
  isDelivered: boolean;
  shippingAddress: ShippingAddress;
  userId?: string | number;
  user_id?: string | number;
}

function isBackendOrderItem(item: unknown): item is {
  id?: string;
  _id?: string;
  name: string;
  quantity: number;
  price: number;
} {
  if (typeof item !== "object" || item === null) return false;
  const obj = item as Record<string, unknown>;
  return (
    (typeof obj.id === "string" || typeof obj._id === "string") &&
    typeof obj.name === "string" &&
    typeof obj.quantity === "number" &&
    typeof obj.price === "number"
  );
}

function isBackendOrder(order: unknown): order is {
  id?: string;
  _id?: string;
  order_items?: unknown[];
  orderItems?: unknown[];
  orderAmount: number;
  created_at: string;
  transactionId: string;
  isDelivered: boolean;
  shippingAddress?: ShippingAddress;
  shipping_address?: ShippingAddress;
  userId?: string | number;
  user_id?: string | number;
} {
  if (typeof order !== "object" || order === null) return false;
  const obj = order as Record<string, unknown>;
  return (
    (typeof obj.id === "string" || typeof obj._id === "string") &&
    (Array.isArray(obj.order_items) || Array.isArray(obj.orderItems)) &&
    typeof obj.orderAmount === "number" &&
    typeof obj.created_at === "string" &&
    typeof obj.transactionId === "string" &&
    typeof obj.isDelivered === "boolean"
  );
}

function mapBackendOrderToOrder(order: unknown): Order | null {
  if (!isBackendOrder(order)) return null;
  const orderItemsRaw = (order.order_items ?? order.orderItems) as unknown[];
  const orderItems: OrderItem[] = Array.isArray(orderItemsRaw)
    ? orderItemsRaw.filter(isBackendOrderItem).map((item) => ({
        _id: (item.id as string) || (item._id as string),
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      }))
    : [];
  const shippingAddress = (order.shippingAddress as ShippingAddress) ||
    (order.shipping_address as ShippingAddress) || {
      address: "",
      city: "",
      country: "",
    };
  return {
    _id: (order.id as string) || (order._id as string),
    orderItems,
    orderAmount: order.orderAmount,
    created_at: order.created_at,
    transactionId: order.transactionId,
    isDelivered: order.isDelivered,
    shippingAddress,
    userId: order.userId,
    user_id: order.user_id,
  };
}

export default function OrderInfo() {
  const { orderid } = useParams<{ orderid: string }>();
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();
  const orderState = useSelector((state: RootState) => state.orderReducer);

  const { order, getOrderByIdLoading, getOrderByIdError } = orderState as {
    order: Order | null;
    getOrderByIdLoading: boolean;
    getOrderByIdError: boolean;
  };

  const currentUser = useMemo(() => {
    const userString = localStorage.getItem("currentUser");
    return userString
      ? (JSON.parse(userString) as { id: string | number })
      : null;
  }, []);

  useEffect(() => {
    if (!currentUser?.id) {
      navigate("/login");
      return;
    }

    if (orderid && currentUser?.id) {
      dispatch(getOrderById(orderid));
    }
  }, [dispatch, orderid, currentUser, navigate]);

  useEffect(() => {
    if (!getOrderByIdLoading && order && currentUser?.id) {
      const orderUserId = order.userId || order.user_id;

      if (orderUserId && String(orderUserId) !== String(currentUser.id)) {
        console.warn("Unauthorized access attempt to order:", orderid);
        navigate("/orders");
        return;
      }
    }
  }, [order, currentUser, orderid, navigate, getOrderByIdLoading]);

  const mappedOrder = order ? mapBackendOrderToOrder(order) : null;

  if (!currentUser?.id) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader />
      </div>
    );
  }

  if (getOrderByIdError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Access Denied
          </h2>
          <p className="mb-4 text-gray-600">
            You don't have permission to view this order, or it doesn't exist.
          </p>
          <button
            onClick={() => navigate("/orders")}
            className="rounded bg-gray-900 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-800"
          >
            View Your Orders
          </button>
        </div>
      </div>
    );
  }

  if (getOrderByIdLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader />
      </div>
    );
  }

  if (!mappedOrder || mappedOrder == null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="text-center">
          <ShoppingBagIcon className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Order not found
          </h2>
          <p className="mb-4 text-gray-600">
            The order you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/orders")}
            className="rounded bg-gray-900 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-800"
          >
            View Your Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-36 min-h-screen bg-white px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm">
          <div className="p-6 text-center">
            <h1 className="mb-1 text-xl font-semibold text-gray-900">
              Order Details
            </h1>
          </div>

          <div className="border-b border-gray-100 px-6 py-4">
            <div className="flex items-center justify-center">
              {mappedOrder.isDelivered ? (
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-semibold text-gray-900">
                    Delivered
                  </span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <ClockIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-semibold text-gray-700">
                    Order Placed
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="border-b border-gray-100 p-6">
            <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <div>
                <p className="mb-1 text-xs tracking-wide text-gray-500 uppercase">
                  Order ID
                </p>
                <p className="font-mono text-gray-900">{mappedOrder._id}</p>
              </div>
              <div>
                <p className="mb-1 text-xs tracking-wide text-gray-500 uppercase">
                  Order Date
                </p>
                <p className="text-gray-900">
                  {new Date(mappedOrder.created_at).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs tracking-wide text-gray-500 uppercase">
                  Transaction ID
                </p>
                <p className="font-mono text-xs break-all text-gray-700">
                  {mappedOrder.transactionId}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs tracking-wide text-gray-500 uppercase">
                  Payment Status
                </p>
                <p className="text-gray-900">Paid</p>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-100 p-6">
            <div className="mb-4 flex items-center">
              <ShoppingBagIcon className="mr-2 h-4 w-4 text-gray-400" />
              <h3 className="text-sm font-semibold tracking-wide text-gray-900 uppercase">
                Items Ordered
              </h3>
            </div>

            <div className="hidden gap-4 border-b border-gray-100 pb-3 sm:grid sm:grid-cols-5">
              <div className="col-span-2 text-xs tracking-wide text-gray-500 uppercase">
                Item
              </div>
              <div className="text-center text-xs tracking-wide text-gray-500 uppercase">
                Qty
              </div>
              <div className="text-right text-xs tracking-wide text-gray-500 uppercase">
                Price
              </div>
              <div className="text-right text-xs tracking-wide text-gray-500 uppercase">
                Total
              </div>
            </div>

            <div className="mt-4 space-y-4">
              {mappedOrder.orderItems.map((item, index) => (
                <div key={item._id}>
                  <div className="hidden items-center gap-4 sm:grid sm:grid-cols-5">
                    <div className="col-span-2 text-gray-900">{item.name}</div>
                    <div className="text-center text-gray-700">
                      {item.quantity}
                    </div>
                    <div className="text-right text-gray-700">
                      ${item.price.toFixed(2)}
                    </div>
                    <div className="text-right font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>

                  <div className="sm:hidden">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="mb-1 text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {index < mappedOrder.orderItems.length - 1 && (
                    <div className="mt-4 border-b border-gray-50"></div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-gray-200 pt-4">
              <div className="flex items-baseline justify-between">
                <span className="font-semibold text-gray-900">
                  Total Amount
                </span>
                <span className="text-2xl font-bold text-green-600">
                  ${mappedOrder.orderAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-100 p-6">
            <div className="mb-3 flex items-center">
              <TruckIcon className="mr-2 h-4 w-4 text-gray-400" />
              <h3 className="text-sm font-semibold tracking-wide text-gray-900 uppercase">
                Shipping Address
              </h3>
            </div>
            <div className="space-y-0.5 text-sm text-gray-700">
              <p>{mappedOrder.shippingAddress.address}</p>
              <p>{mappedOrder.shippingAddress.city}</p>
              <p>{mappedOrder.shippingAddress.country}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-6">
            <p className="mb-3 text-center text-sm text-gray-600">
              Questions about your order?{" "}
              <a className="underline" href="/#contact">
                Contact our support team
              </a>
              .
            </p>
            <div className="text-xs leading-relaxed text-gray-500">
              <p>
                Returns and replacements are subject to our standard policy
                terms. Items must be returned within 30 days of delivery in
                original condition.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
