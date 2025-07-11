import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Error from "@/components/ui/error";
import Loader from "@/components/ui/loader";
import Success from "@/components/ui/success";
import ImageUpload from "@/components/ui/ImageUpload";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProductById,
  updateProduct,
  getAllProducts,
} from "@/redux/product.slice";
import type { RootState, AppDispatch } from "@/redux/store";

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const productState = useSelector((state: RootState) => state.productReducer);
  const { product, loading, error } = productState;

  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [countInStock, setCountInStock] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [imageUploadMode, setImageUploadMode] = useState<"url" | "upload">(
    "url",
  );

  useEffect(() => {
    if (id) {
      dispatch(getProductById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (product && product.id) {
      console.log("Product data received:", product);
      setName(product.name || "");
      setPrice(product.price?.toString() || "");
      setDescription(product.description || "");
      setImageUrl(product.image || "");
      setCategory(product.category || "");
      setCountInStock(product.countInStock?.toString() || "");
    }
  }, [product]);

  const handleImageModeChange = (mode: "url" | "upload") => {
    setImageUploadMode(mode);
  };

  async function editProduct(e: FormEvent) {
    e.preventDefault();
    if (!id) {
      setUpdateError("Product ID is missing");
      return;
    }

    if (!imageUrl.trim()) {
      setUpdateError(
        "Please provide a product image (either URL or upload a file)",
      );
      return;
    }

    const updatedProduct = {
      name: name || "",
      price: Math.round(Number(price) || 0),
      description: description || "",
      countInStock: Number(countInStock) || 0,
      category: category || "",
      image: imageUrl || "",
      rating: Math.round(product?.rating || 0),
    };

    setUpdateLoading(true);
    setUpdateError(null);
    setSuccess(false);
    try {
      const resultAction = await dispatch(
        updateProduct({ productid: id, updatedproduct: updatedProduct }),
      );
      if (updateProduct.fulfilled.match(resultAction)) {
        setSuccess(true);
        dispatch(getAllProducts());
        setTimeout(() => {
          navigate("/admin/productslist");
        }, 1500);
      } else {
        console.error("Update failed:", resultAction.payload);
        setUpdateError(
          (resultAction.payload as string) || "Something went wrong",
        );
      }
    } catch (error) {
      console.error("Update error:", error);
      setUpdateError("Something went wrong");
    } finally {
      setUpdateLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {loading && (
          <div className="mb-6">
            <Loader />
          </div>
        )}
        {updateLoading && (
          <div className="mb-6">
            <Loader />
          </div>
        )}
        {updateError && (
          <div className="mb-6">
            <Error error={updateError} />
          </div>
        )}
        {success && (
          <div className="mb-6">
            <Success success="Product Updated Successfully! Redirecting to product list..." />
          </div>
        )}
        {error && (
          <div className="mb-6">
            <Error error="Something went wrong" />
          </div>
        )}

        {!loading && (!product || !product.id) && (
          <div className="mx-auto max-w-2xl">
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
              <p className="text-gray-600">Product not found</p>
            </div>
          </div>
        )}

        {product && product.id && (
          <div className="mx-auto max-w-2xl">
            <div className="mb-8">
              <h1 className="mb-2 text-2xl font-semibold text-gray-900">
                Edit Product
              </h1>
              <p className="text-gray-600">Update product information</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-8">
              <form onSubmit={editProduct} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Product Name
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500"
                      placeholder="Enter product name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500"
                      placeholder="0.00"
                      value={price}
                      required
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    required
                    rows={4}
                    className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500"
                    placeholder="Enter product description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Product Image
                  </label>

                  {imageUrl && (
                    <div className="mb-4">
                      <p className="mb-2 text-sm text-gray-600">
                        Current Image:
                      </p>
                      <img
                        src={imageUrl}
                        alt="Current product"
                        className="h-32 w-32 rounded-lg border border-gray-200 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                    </div>
                  )}

                  <div className="mb-4">
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="imageMode"
                          value="url"
                          checked={imageUploadMode === "url"}
                          onChange={(e) =>
                            handleImageModeChange(
                              e.target.value as "url" | "upload",
                            )
                          }
                          className="mr-2 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">
                          Use Image URL
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="imageMode"
                          value="upload"
                          checked={imageUploadMode === "upload"}
                          onChange={(e) =>
                            handleImageModeChange(
                              e.target.value as "url" | "upload",
                            )
                          }
                          className="mr-2 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">
                          Upload New Image
                        </span>
                      </label>
                    </div>
                  </div>

                  {imageUploadMode === "url" && (
                    <input
                      type="url"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500"
                      placeholder="https://example.com/image.jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                    />
                  )}

                  {imageUploadMode === "upload" && (
                    <div className="space-y-3">
                      <ImageUpload
                        onChange={(url) => {
                          if (url) {
                            setImageUrl(url);
                          }
                        }}
                      />
                      {imageUrl && imageUploadMode === "upload" && (
                        <div className="flex items-center text-sm text-green-600">
                          <svg
                            className="mr-1 h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          New image uploaded successfully
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <select
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2 transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="">Select category</option>
                      <option value="Medicine">Medicine</option>
                      <option value="Health Supplements">
                        Health Supplements
                      </option>
                      <option value="Medical Equipment">
                        Medical Equipment
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Stock Count
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500"
                      placeholder="0"
                      value={countInStock}
                      onChange={(e) => setCountInStock(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-between border-t border-gray-200 pt-6">
                  <button
                    type="button"
                    onClick={() => navigate("/admin/productslist")}
                    className="rounded-md border border-gray-300 bg-white px-6 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
                  >
                    Back to Products
                  </button>
                  <button
                    type="submit"
                    disabled={updateLoading}
                    className="rounded-md bg-green-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {updateLoading ? "Updating..." : "Update Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
