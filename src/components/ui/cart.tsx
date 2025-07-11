import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog } from "@headlessui/react";
import {
  XMarkIcon,
  MinusIcon,
  PlusIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { removeFromCart, updateCartQuantity } from "../../redux/cart.slice";
import { getAllProducts } from "../../redux/product.slice";
import type { RootState, AppDispatch } from "../../redux/store";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  countInStock: number;
}

type CartProps = {
  open: boolean;
  onClose: () => void;
};

export default function Cart({ open, onClose }: CartProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { cartItems } = useSelector((state: RootState) => state.cartReducer);
  const { products } = useSelector((state: RootState) => state.productReducer);

  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const getProductCurrentStock = (productId: string): number => {
    const currentProduct = products.find((p) => String(p.id) === productId);
    return currentProduct?.countInStock || 0;
  };

  const isItemOverStock = (item: CartItem): boolean => {
    const currentStock = getProductCurrentStock(String(item.id));
    return item.quantity > currentStock;
  };

  const getValidQuantity = (item: CartItem): number => {
    const currentStock = getProductCurrentStock(String(item.id));
    return Math.min(item.quantity, currentStock);
  };

  const total = cartItems.reduce((sum, item) => {
    const validQuantity = getValidQuantity(item);
    return sum + item.price * validQuantity;
  }, 0);

  useEffect(() => {
    if (open && products.length === 0) {
      dispatch(getAllProducts());
    }
  }, [open, dispatch, products.length]);

  const handleRemoveFromCart = (id: string) => {
    dispatch(removeFromCart({ id: Number(id) }));
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(id);
    } else {
      const currentStock = getProductCurrentStock(id);
      const validQuantity = Math.min(newQuantity, currentStock);
      dispatch(updateCartQuantity({ id: Number(id), quantity: validQuantity }));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-y-0 right-0 w-full max-w-md overflow-y-auto bg-white p-4 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <Dialog.Title className="text-lg font-semibold text-gray-900">
            Shopping Cart
          </Dialog.Title>
          <button onClick={onClose}>
            <XMarkIcon className="size-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <>
            {cartItems.length === 0 ? (
              <p className="text-sm text-gray-500">Your cart is empty.</p>
            ) : (
              <ul className="-my-6 divide-y divide-gray-200">
                {cartItems.map((item) => {
                  const currentStock = getProductCurrentStock(String(item.id));
                  const isOverStock = isItemOverStock(item);

                  return (
                    <li key={item.id} className="flex py-6">
                      <div className="ml-4 flex flex-1 flex-col">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>
                            <Link to={`/products/${item.id}`}>{item.name}</Link>
                          </h3>
                          <p>NPR {item.price}</p>
                        </div>

                        {isOverStock && (
                          <div className="mt-1 flex items-center gap-1 text-xs text-amber-600">
                            <ExclamationTriangleIcon className="h-3 w-3" />
                            <span>Only {currentStock} left in stock</span>
                          </div>
                        )}

                        <div className="mt-2 flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                handleQuantityChange(String(item.id), item.quantity - 1)
                              }
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <MinusIcon className="h-4 w-4" />
                            </button>
                            <span
                              className={`min-w-[2ch] text-center ${isOverStock ? "font-medium text-amber-600" : "text-gray-700"}`}
                            >
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(String(item.id), item.quantity + 1)
                              }
                              disabled={item.quantity >= currentStock}
                              className={`p-1 ${item.quantity >= currentStock ? "cursor-not-allowed text-gray-300" : "text-gray-400 hover:text-gray-600"}`}
                            >
                              <PlusIcon className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <button
                              onClick={() => handleRemoveFromCart(String(item.id))}
                              className="text-sm text-red-600 hover:text-red-500"
                            >
                              Remove
                            </button>
                            {isOverStock && (
                              <button
                                onClick={() =>
                                  handleQuantityChange(String(item.id), currentStock)
                                }
                                className="text-xs text-blue-600 hover:text-blue-500"
                              >
                                Fix quantity
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="mt-1 text-xs text-gray-500">
                          {currentStock > 0
                            ? `${currentStock} available`
                            : "Out of stock"}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}
        <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
          <div className="flex justify-between text-base font-medium text-gray-900">
            <p>Subtotal</p>
            <p>NPR {total.toFixed(2)}</p>
          </div>
          <p className="mt-0.5 text-sm text-gray-500">
            Shipping and taxes calculated at checkout.
          </p>

          {cartItems.some((item) => isItemOverStock(item)) && (
            <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3">
              <div className="flex items-center gap-2 text-sm text-amber-800">
                <ExclamationTriangleIcon className="h-4 w-4 flex-shrink-0" />
                <span>
                  Some items exceed available stock. Please adjust quantities
                  before checkout.
                </span>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              to={
                cartItems.some((item) => isItemOverStock(item))
                  ? "#"
                  : "/checkout"
              }
              className={`py3 relative isolate flex cursor-default items-baseline justify-center gap-x-2 rounded-lg border border-green-700 bg-green-600 px-30 py-3 text-base/6 font-semibold text-white [--btn-hover-overlay:var(--color-white)]/10 before:absolute before:inset-0 before:-z-10 before:rounded-[calc(var(--radius-lg)-1px)] before:bg-(--btn-bg) before:shadow-sm after:absolute after:inset-0 after:-z-10 after:rounded-[calc(var(--radius-lg)-1px)] after:shadow-[inset_0_1px_--theme(--color-white/15%)] data-active:[--btn-icon:var(--color-green-300)] data-active:after:bg-(--btn-hover-overlay) data-disabled:opacity-50 data-disabled:before:shadow-none data-disabled:after:shadow-none data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-green-500 data-hover:[--btn-icon:var(--color-green-300)] data-hover:after:bg-(--btn-hover-overlay) *:data-[slot=icon]:-mx-0.5 *:data-[slot=icon]:my-0.5 *:data-[slot=icon]:size-5 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:self-center *:data-[slot=icon]:text-(--btn-icon) forced-colors:[--btn-icon:ButtonText] forced-colors:data-hover:[--btn-icon:ButtonText] ${
                cartItems.some((item) => isItemOverStock(item)) ||
                cartItems.length === 0
                  ? "cursor-not-allowed border-gray-300 bg-gray-300 text-gray-500"
                  : "border-green-700 bg-green-600 text-white hover:bg-green-700"
              }`}
              onClick={(e) => {
                if (
                  cartItems.some((item) => isItemOverStock(item)) ||
                  cartItems.length === 0
                ) {
                  e.preventDefault();
                }
              }}
            >
              {cartItems.length === 0 ? "Cart is Empty" : "Checkout"}
            </Link>
          </div>
          <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
            <p>
              or{" "}
              <button
                type="button"
                onClick={onClose}
                className="font-medium text-green-600 hover:text-green-500"
              >
                Continue Shopping
                <span aria-hidden="true"> &rarr;</span>
              </button>
            </p>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
