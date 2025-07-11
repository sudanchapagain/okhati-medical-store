import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Error from "@/components/ui/error";
import Loader from "@/components/ui/loader";
import { filterProducts } from "../redux/product.slice";
import { Link } from "react-router-dom";
import type { RootState, AppDispatch } from "../redux/store";

export default function Products() {
  const dispatch = useDispatch<AppDispatch>();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortKey] = useState("popular");

  const { loading, products, error } = useSelector(
    (state: RootState) => state.productReducer,
  );

  const categories = ["Medicine", "Health Supplements", "Medical Equipment"];

  useEffect(() => {
    dispatch(
      filterProducts({
        searchKey: searchQuery.toLowerCase(),
        sortKey,
        category: selectedCategory ? selectedCategory.toLowerCase() : "all",
      }),
    );
  }, [dispatch, searchQuery, sortKey, selectedCategory]);

  return (
    <div className="mt-16 bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Products
        </h1>

        <div className="my-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="sm:w-1/1.5 w-full rounded-lg border border-gray-300 px-2 py-3 text-gray-800 shadow-sm transition focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 shadow-sm transition focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none sm:w-1/3"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        ) : error ? (
          <div className="py-12">
            <Error error="Failed to load products. Please try again." />
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {products.length === 0 ? (
              <div className="col-span-full py-12 text-center">
                <p className="text-gray-500">
                  No products found matching your criteria.
                </p>
              </div>
            ) : (
              products.map((product) => (
                <div key={product.id} className="group relative">
                  <Link to={`/products/${product.id}`}>
                    <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-auto lg:h-80">
                      <img
                        alt={product.name}
                        src={product.image}
                        width={500}
                        height={500}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm text-gray-700">
                            {product.name}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {product.category}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          NPR {product.price}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
