import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import useClearCartOnPayment from "@/hooks/useClearCartOnPayment";
import {
  PaymentCompletedIcon,
  PaymentPendingIcon,
  PaymentFailedIcon,
  PaymentUnknownIcon,
} from "@/components/ui/PaymentStatusIcons";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const statusConfig = {
  Completed: {
    icon: <PaymentCompletedIcon />,
    color: "text-green-600",
    bg: "bg-green-50",
    message: "Payment successful! Thank you for your order.",
  },
  Pending: {
    icon: <PaymentPendingIcon />,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    message: "Payment is pending. Please wait or contact support.",
  },
  Failed: {
    icon: <PaymentFailedIcon />,
    color: "text-red-600",
    bg: "bg-red-50",
    message: "Payment failed. Please try again or use a different method.",
  },
  Unknown: {
    icon: <PaymentUnknownIcon />,
    color: "text-gray-600",
    bg: "bg-gray-50",
    message:
      "Payment status unknown. Please check your order history or contact support.",
  },
};

export default function PaymentStatus() {
  useClearCartOnPayment();
  const query = useQuery();
  const [status, setStatus] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const paymentStatus = query.get("status");
    setStatus(paymentStatus);
    if (paymentStatus === "Completed") {
      setMessage(statusConfig.Completed.message);
    } else if (paymentStatus === "Pending") {
      setMessage(statusConfig.Pending.message);
    } else if (paymentStatus === "Failed") {
      setMessage(statusConfig.Failed.message);
    } else {
      setMessage(statusConfig.Unknown.message);
    }
  }, [query]);

  const config =
    status === "Completed"
      ? statusConfig.Completed
      : status === "Pending"
        ? statusConfig.Pending
        : status === "Failed"
          ? statusConfig.Failed
          : statusConfig.Unknown;

  return (
    <div
      className={`mx-auto my-32 max-w-md rounded-xl border border-gray-100 ${config.bg} animate-fade-in p-8 text-center`}
    >
      {config.icon}
      <h2 className="mb-2 text-3xl font-extrabold tracking-tight">
        Khalti Payment Status
      </h2>
      <div className={`mb-4 text-lg font-semibold ${config.color}`}>
        {message}
      </div>
      <div className="mb-6 rounded-lg border border-gray-200 bg-white/80 p-4 text-sm text-gray-700">
        <div className="mb-1">
          <b>pidx:</b> <span className="break-all">{query.get("pidx")}</span>
        </div>
        <div className="mb-1">
          <b>Transaction ID:</b>{" "}
          <span className="break-all">{query.get("transaction_id")}</span>
        </div>
        <div className="mb-1">
          <b>Amount:</b> NPR {query.get("amount")}
        </div>
        <div>
          <b>Status:</b> {query.get("status")}
        </div>
      </div>
      <Link
        to="/"
        className="inline-block rounded-lg bg-green-600 px-6 py-2 font-semibold text-white shadow-md transition hover:bg-green-700"
      >
        Back to Home
      </Link>
    </div>
  );
}
