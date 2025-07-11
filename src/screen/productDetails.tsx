import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addItemToCart } from "@/redux/cart.slice";
import { getProductById } from "@/redux/product.slice";
import type { RootState, AppDispatch } from "@/redux/store";
import Loader from "@/components/ui/loader";
import Error from "@/components/ui/error";
import { ArrowUturnLeftIcon, TagIcon } from "@heroicons/react/24/outline";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [cartError, setCartError] = useState("");
  const productState = useSelector((state: RootState) => state.productReducer);
  const { product, loading, error } = productState;
  const [quantity, setQuantity] = useState(1);

  const addCart = () => {
    const parsedQuantity = parseInt(quantity.toString());
    if (
      isNaN(parsedQuantity) ||
      parsedQuantity <= 0 ||
      parsedQuantity > (product?.countInStock || 0)
    ) {
      setCartError("Invalid quantity");
      return;
    }
    setCartError("");
    dispatch(addItemToCart({ product, quantity: parsedQuantity }));
  };

  useEffect(() => {
    if (id) {
      dispatch(getProductById(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <Error error={error} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Product not found
          </h2>
          <Link
            to="/products"
            className="text-green-600 underline hover:text-green-700"
          >
            Return to products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="pt-24 pb-16">
        <div className="mx-auto max-w-6xl space-y-8 bg-white p-8">
          <Link to="/products">
            <p className="mb-4 max-w-28 rounded-full bg-gray-500 px-4 py-2 text-sm font-bold text-gray-100">
              <ArrowUturnLeftIcon className="mb-1 inline h-4 w-6 text-gray-100" />
              Return
            </p>
          </Link>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="relative">
              <div className="overflow-hidden rounded-md border border-green-100 bg-gray-50">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-auto max-h-[500px] w-full object-contain"
                  />
                )}
              </div>
            </div>

            <div className="space-y-6">
              <h1 className="mb-0.5 text-3xl font-bold tracking-tight text-gray-900">
                {product.name}
              </h1>

              {product.category && (
                <p className="text-base text-gray-700">
                  <TagIcon className="mr-2 inline size-5" />
                  {product.category}
                </p>
              )}

              <p className="text-3xl font-bold tracking-tight text-gray-900">
                NPR - {product.price}
              </p>

              <p className="text-base text-gray-700">
                In stock:{" "}
                {product.countInStock > 0
                  ? `Yes (${product.countInStock} available)`
                  : "No"}
              </p>

              {product.countInStock > 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none"
                  >
                    {[...Array(product.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {product.countInStock > 0 ? (
                <button
                  type="button"
                  onClick={addCart}
                  className="w-full rounded-md bg-green-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-green-700"
                >
                  Add to Cart
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full cursor-not-allowed rounded-md bg-gray-300 px-6 py-3 text-base font-medium text-gray-500"
                >
                  Out of Stock
                </button>
              )}

              <div className="border-t border-gray-200 pt-4">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Description
                </h3>
                <p className="text-base text-gray-700">{product.description}</p>
              </div>
            </div>
          </div>

          {cartError && (
            <div className="mt-4">
              <Error error={cartError} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
