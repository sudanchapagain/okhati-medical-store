import Loader from "@/components/ui/loader";
import ErrorComponent from "@/components/ui/error";
import Success from "@/components/ui/success";
import { useSelector } from "react-redux";
import { useState } from "react";
import type { RootState } from "@/redux/store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  name: string;
  email: string;
  is_staff: boolean;
  is_active: boolean;
}

interface CartItem {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  quantity: number;
}

const schema = z.object({
  customerName: z.string().min(2, { message: "Name required" }),
  customerEmail: z.email({ message: "Invalid email" }),
  customerPhone: z.string().min(7, { message: "Phone required" }),
  customerAddress: z.string().min(2, { message: "Address required" }),
});
type FormData = z.infer<typeof schema>;

export default function Checkout() {
  const cartreducerstate = useSelector((state: RootState) => state.cartReducer);
  const { cartItems } = cartreducerstate;
  const user = localStorage.getItem("currentUser");
  const navigate = useNavigate();

  let currentUser: User | null = null;
  if (user) {
    const data = JSON.parse(user);
    currentUser = {
      id: data.id,
      name: data.name,
      email: data.email,
      is_staff: data.is_staff,
      is_active: data.is_active,
    };
  }

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const cartItemsTyped: CartItem[] = cartItems || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      customerName: currentUser?.name || "",
      customerEmail: currentUser?.email || "",
      customerPhone: "",
      customerAddress: "",
    },
  });

  const getValidQuantity = (item: CartItem): number => {
    return item.quantity;
  };
  const subtotal = cartItemsTyped.reduce((sum, item) => {
    const validQuantity = getValidQuantity(item);
    return sum + item.price * validQuantity;
  }, 0);

  async function onSubmit(form: FormData) {
    setLoading(true);
    setError(null);
    try {
      if (
        !cartItemsTyped.length ||
        cartItemsTyped.some(
          (item) => !item.id || !item.name || !item.price || !item.quantity,
        )
      ) {
        setError("Cart data is invalid. Please refresh and try again.");
        setLoading(false);
        return;
      }
      const payload = {
        token: {
          id: "khalti",
          email: form.customerEmail,
          card: {
            address_line1: form.customerAddress,
            address_city: "Kathmandu",
            address_country: "Nepal",
            address_zip: "44600",
          },
        },
        cartItems: cartItemsTyped.map((item) => ({
          name: item.name,
          quantity: getValidQuantity(item),
          price: Math.round(item.price),
        })),
        currentUser: {
          id: currentUser?.id || 0,
          name: form.customerName,
          email: form.customerEmail,
          is_staff: currentUser?.is_staff || false,
          is_active: currentUser?.is_active || false,
        },
        subtotal: Math.round(subtotal),
      };

      const res = await fetch("/api/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      let data;
      try {
        data = await res.json();
      } catch {
        setError("Server error: Invalid response from backend.");
        setLoading(false);
        return;
      }
      if (!data.success) {
        console.error("Backend error:", data.error);
        throw new Error(data.error || "Payment initiation failed");
      }
      setSuccess(true);
      if (data.payment_url && data.payment_url.startsWith("http")) {
        window.location.assign(data.payment_url);
      } else {
        navigate(data.payment_url, { replace: true });
      }
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Payment failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto my-34 max-w-md rounded-xl border border-gray-100 bg-white p-8 shadow-lg">
      <h2 className="mb-6 text-center text-2xl font-bold tracking-tight">
        Checkout with Khalti
      </h2>
      {loading && <Loader />}
      {success && <Success success="Redirecting to Khalti..." />}
      {error && <ErrorComponent error={error} />}
      <form
        className="space-y-6"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <div>
          <label className="mb-1 block font-semibold text-gray-700">Name</label>
          <input
            className="w-full rounded-lg border border-gray-300 px-4 py-2 placeholder-gray-400 transition focus:border-green-600 focus:ring-2 focus:ring-green-600 focus:outline-none"
            placeholder="Your Name"
            {...register("customerName")}
          />
          {errors.customerName && (
            <span className="mt-1 block text-xs text-red-500">
              {errors.customerName.message}
            </span>
          )}
        </div>
        <div>
          <label className="mb-1 block font-semibold text-gray-700">
            Email
          </label>
          <input
            className="w-full rounded-lg border border-gray-300 px-4 py-2 placeholder-gray-400 transition focus:border-green-600 focus:ring-2 focus:ring-green-600 focus:outline-none"
            placeholder="you@email.com"
            {...register("customerEmail")}
          />
          {errors.customerEmail && (
            <span className="mt-1 block text-xs text-red-500">
              {errors.customerEmail.message}
            </span>
          )}
        </div>
        <div>
          <label className="mb-1 block font-semibold text-gray-700">
            Phone
          </label>
          <input
            className="w-full rounded-lg border border-gray-300 px-4 py-2 placeholder-gray-400 transition focus:border-green-600 focus:ring-2 focus:ring-green-600 focus:outline-none"
            placeholder="98XXXXXXXX"
            maxLength={10}
            type="tel"
            {...register("customerPhone")}
          />
          {errors.customerPhone && (
            <span className="mt-1 block text-xs text-red-500">
              {errors.customerPhone.message}
            </span>
          )}
        </div>
        <div>
          <label className="mb-1 block font-semibold text-gray-700">
            Address
          </label>
          <input
            className="w-full rounded-lg border border-gray-300 px-4 py-2 placeholder-gray-400 transition focus:border-green-600 focus:ring-2 focus:ring-green-600 focus:outline-none"
            placeholder="Your Address"
            {...register("customerAddress")}
          />
          {errors.customerAddress && (
            <span className="mt-1 block text-xs text-red-500">
              {errors.customerAddress.message}
            </span>
          )}
        </div>
        <button
          className="mt-4 w-full rounded-lg bg-green-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-green-700 disabled:opacity-60"
          type="submit"
          disabled={loading || !cartItemsTyped.length}
        >
          {loading
            ? "Redirecting to Khalti..."
            : `Pay NPR ${subtotal.toFixed(2)} with Khalti`}
        </button>
      </form>
    </div>
  );
}
