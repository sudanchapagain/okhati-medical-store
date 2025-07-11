import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/solid";

export const PaymentCompletedIcon = () => (
  <CheckCircleIcon className="mx-auto mb-4 h-16 w-16 text-green-500" />
);
export const PaymentPendingIcon = () => (
  <ExclamationCircleIcon className="mx-auto mb-4 h-16 w-16 text-yellow-500" />
);
export const PaymentFailedIcon = () => (
  <XCircleIcon className="mx-auto mb-4 h-16 w-16 text-red-500" />
);
export const PaymentUnknownIcon = () => (
  <QuestionMarkCircleIcon className="mx-auto mb-4 h-16 w-16 text-gray-400" />
);
