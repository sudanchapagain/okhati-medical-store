import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Error from "@/components/ui/error";
import Loader from "@/components/ui/loader";
import Success from "@/components/ui/success";
import ImageUpload from "@/components/ui/ImageUpload";
import { addProduct, getAllProducts } from "../redux/product.slice";
import type { RootState, AppDispatch } from "../redux/store";

export default function AddProduct() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [name, setname] = useState<string>("");
  const [price, setprice] = useState<string>("");
  const [countinstock, setcountinstock] = useState<string>("");
  const [imageurl, setimageurl] = useState<string>("");
  const [category, setcategory] = useState<string>("");
  const [description, setdescription] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [imageUploadMode, setImageUploadMode] = useState<"url" | "upload">(
    "upload",
  );

  const addproductstate = useSelector(
    (state: RootState) => state.productReducer,
  );
  const { loading, error } = addproductstate;

  const addproduct = async (e: FormEvent) => {
    e.preventDefault();

    if (!imageurl.trim()) {
      setAddError(
        "Please provide a product image (either URL or upload a file)",
      );
      return;
    }

    const product = {
      id: 0,
      name: name,
      image: imageurl,
      category: category,
      description: description,
      price: Number(price),
      countInStock: Number(countinstock),
      rating: 0,
    };

    setAddError(null);
    setSuccess(false);

    try {
      const resultAction = await dispatch(addProduct(product));
      if (addProduct.fulfilled.match(resultAction)) {
        setSuccess(true);
        dispatch(getAllProducts());
        setTimeout(() => {
          navigate("/admin/productslist");
        }, 1500);
      } else {
        setAddError(
          (resultAction.payload as string) || "Failed to add product",
        );
      }
    } catch {
      setAddError("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {loading && (
          <div className="mb-6">
            <Loader />
          </div>
        )}
        {addError && (
          <div className="mb-6">
            <Error error={addError} />
          </div>
        )}
        {error && (
          <div className="mb-6">
            <Error error="Something went wrong" />
          </div>
        )}
        {success && (
          <div className="mb-6">
            <Success success="Product Added Successfully! Redirecting to product list..." />
          </div>
        )}

        <div className="mx-auto max-w-2xl">
          <div className="mb-8">
            <h1 className="mb-2 text-2xl font-semibold text-gray-900">
              Add New Product
            </h1>
            <p className="text-gray-600">Create a new product for the store</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-8">
            <form onSubmit={addproduct} className="space-y-6">
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
                    onChange={(e) => setname(e.target.value)}
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
                    onChange={(e) => setprice(e.target.value)}
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
                  onChange={(e) => setdescription(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Product Image
                </label>

                {imageurl && (
                  <div className="mb-4">
                    <p className="mb-2 text-sm text-gray-600">Preview:</p>
                    <img
                      src={imageurl}
                      alt="Product preview"
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
                        value="upload"
                        checked={imageUploadMode === "upload"}
                        onChange={(e) =>
                          setImageUploadMode(e.target.value as "url" | "upload")
                        }
                        className="mr-2 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">
                        Upload Image File
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="imageMode"
                        value="url"
                        checked={imageUploadMode === "url"}
                        onChange={(e) =>
                          setImageUploadMode(e.target.value as "url" | "upload")
                        }
                        className="mr-2 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">
                        Use Image URL
                      </span>
                    </label>
                  </div>
                </div>

                {imageUploadMode === "upload" && (
                  <div className="space-y-3">
                    <ImageUpload
                      onChange={(url) => {
                        if (url) {
                          setimageurl(url);
                        }
                      }}
                    />
                    {imageurl && (
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
                        Image uploaded successfully
                      </div>
                    )}
                  </div>
                )}

                {imageUploadMode === "url" && (
                  <input
                    type="url"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500"
                    placeholder="https://example.com/image.jpg"
                    value={imageurl}
                    onChange={(e) => setimageurl(e.target.value)}
                  />
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
                    onChange={(e) => setcategory(e.target.value)}
                  >
                    <option value="">Select category</option>
                    <option value="Medicine">Medicine</option>
                    <option value="Health Supplements">
                      Health Supplements
                    </option>
                    <option value="Personal Care">Personal Care</option>
                    <option value="Medical Equipment">Medical Equipment</option>
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
                    value={countinstock}
                    onChange={(e) => setcountinstock(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-green-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
