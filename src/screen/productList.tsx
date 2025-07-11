import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "@/components/ui/loader";
import { deleteProduct, filterProducts } from "@/redux/product.slice";
import type { RootState, AppDispatch } from "@/redux/store";
import {
  CubeIcon,
  ArchiveBoxIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

interface Product {
  id: number;
  name: string;
  price: number;
  countInStock: number;
}

export default function ProductList() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const getallproductsstate = useSelector(
    (state: RootState) => state.productReducer,
  );
  const { products, loading, error } = getallproductsstate;

  useEffect(() => {
    dispatch(
      filterProducts({ searchKey: "", sortKey: "popular", category: "all" }),
    );
  }, [dispatch]);

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(productId));
      dispatch(
        filterProducts({ searchKey: "", sortKey: "popular", category: "all" }),
      );
    }
  };

  const trimProductName = (name: string, maxLength: number = 70) => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + "...";
  };

  const formatProductId = (id: number, maxLength: number = 8) => {
    const idStr = String(id);
    return idStr.length > maxLength
      ? `${idStr.substring(0, maxLength)}...`
      : idStr;
  };

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
        <div className="text-center">
          <CubeIcon className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Unable to load products
          </h2>
          <p className="mb-4 text-gray-600">
            Something went wrong while fetching the products.
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
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Product Management
            </h1>
            <p className="text-gray-600">
              Manage your product inventory and listings
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/addnewproduct")}
            className="inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add New Product
          </button>
        </div>

        <div className="hidden lg:block">
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr] gap-4 border-b border-gray-200 bg-gray-50 px-6 py-4">
              <div className="text-xs font-semibold tracking-wide text-gray-600 uppercase">
                Product Name
              </div>
              <div className="text-xs font-semibold tracking-wide text-gray-600 uppercase">
                Price
              </div>
              <div className="text-xs font-semibold tracking-wide text-gray-600 uppercase">
                Stock
              </div>
              <div className="text-xs font-semibold tracking-wide text-gray-600 uppercase">
                Product ID
              </div>
              <div className="text-xs font-semibold tracking-wide text-gray-600 uppercase">
                Actions
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {products && products.length > 0 ? (
                products.map((product: Product) => (
                  <div
                    key={product.id}
                    className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-4 transition-all duration-200 hover:bg-gray-50"
                  >
                    <div className="flex min-w-0 items-center">
                      <div className="mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-green-100">
                        <CubeIcon className="h-4 w-4 text-green-600" />
                      </div>
                      <span
                        className="truncate text-sm font-medium text-gray-900"
                        title={product.name}
                      >
                        {trimProductName(product.name, 50)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-mono text-sm text-gray-500">
                        NPR {product.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-xs ${
                          product.countInStock > 10
                            ? "bg-green-100 text-green-800"
                            : product.countInStock > 0
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.countInStock}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-mono text-xs text-gray-500">
                        {formatProductId(product.id)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => navigate(`/products/${product.id}`)}
                        className="rounded-md p-1.5 text-gray-500 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
                        title="View Product"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/admin/editproduct/${product.id}`)
                        }
                        className="rounded-md p-1.5 text-gray-500 transition-all duration-200 hover:bg-green-50 hover:text-green-600"
                        title="Edit Product"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(String(product.id))}
                        className="rounded-md p-1.5 text-gray-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
                        title="Delete Product"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-12 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <CubeIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-gray-900">
                    No products found
                  </h3>
                  <p className="mb-4 text-gray-500">
                    Get started by adding your first product.
                  </p>
                  <button
                    onClick={() => navigate("/admin/addnewproduct")}
                    className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                  >
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add Product
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:hidden">
          <div className="space-y-3">
            {products && products.length > 0 ? (
              products.map((product: Product) => (
                <div
                  key={product.id}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-center">
                        <div className="mr-2 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-green-100">
                          <CubeIcon className="h-3 w-3 text-green-600" />
                        </div>
                        <h3 className="truncate text-sm font-medium text-gray-900">
                          {product.name}
                        </h3>
                      </div>
                      <p className="font-mono text-xs text-gray-500">
                        ID: {formatProductId(product.id, 12)}
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0 text-right">
                      <p className="text-lg font-bold text-green-600">
                        NPR {product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center">
                      <ArchiveBoxIcon className="mr-2 h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Stock: </span>
                      <span
                        className={`ml-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          product.countInStock > 10
                            ? "bg-green-100 text-green-800"
                            : product.countInStock > 0
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.countInStock} units
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-3">
                    <button
                      onClick={() => navigate(`/products/${product.id}`)}
                      className="flex items-center justify-center rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-600 transition-colors hover:bg-gray-100"
                    >
                      <EyeIcon className="mr-1 h-3 w-3" />
                      View
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/admin/editproduct/${product.id}`)
                      }
                      className="flex items-center justify-center rounded-md bg-blue-50 px-3 py-2 text-xs text-blue-600 transition-colors hover:bg-blue-100"
                    >
                      <PencilIcon className="mr-1 h-3 w-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(String(product.id))}
                      className="flex items-center justify-center rounded-md bg-red-50 px-3 py-2 text-xs text-red-600 transition-colors hover:bg-red-100"
                    >
                      <TrashIcon className="mr-1 h-3 w-3" />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <CubeIcon className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  No products found
                </h3>
                <p className="mb-4 text-gray-500">
                  Get started by adding your first product.
                </p>
                <button
                  onClick={() => navigate("/admin/addnewproduct")}
                  className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm text-white transition-colors hover:bg-green-700"
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Your First Product
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
