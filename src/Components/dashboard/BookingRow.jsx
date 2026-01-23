// Status badge styling
const getStatusBadge = (status) => {
  const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";

  switch (status) {
    case "confirmed":
      return `${baseClasses} bg-green-100 text-green-800`;
    case "pending":
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    case "cancelled":
      return `${baseClasses} bg-red-100 text-red-800`;
    case "expired":
      return `${baseClasses} bg-gray-100 text-gray-800`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`;
  }
};

// Payment status badge styling
const getPaymentStatusBadge = (paymentStatus) => {
  const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";

  switch (paymentStatus) {
    case "paid":
      return `${baseClasses} bg-green-100 text-green-800`;
    case "unpaid":
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    case "failed":
      return `${baseClasses} bg-red-100 text-red-800`;
    case "refunded":
      return `${baseClasses} bg-blue-100 text-blue-800`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`;
  }
};

// Payment method display
const getPaymentMethodDisplay = (method) => {
  switch (method) {
    case "card":
      return "💳 Card";
    case "apple":
      return "🍎 Apple Pay";
    case "wallet":
      return "💰 Wallet";
    default:
      return method;
  }
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  } catch (error) {
    return "Invalid Date";
  }
};

// Format currency
const formatCurrency = (amount, currency = "EGP") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount || 0);
};

import usePostData from "@/hooks/curdsHook/usePostData";
import endPoints from "@/config/endPoints";

function BookingRow({ booking }) {
  const pkg = booking?.package;

  const { mutate: refundMutate, isPending: isRefunding } = usePostData(
    `${endPoints.bookings}${booking._id}/refund`,
    [`refundBooking-${booking._id}`],
    ["bookings"] // Invalidate main bookings list
  );

  const handleRefund = () => {
    if (window.confirm(`Are you sure you want to refund ${booking.name}? This action cannot be undone.`)) {
      refundMutate({ data: {} }); // POST with empty body
    }
  };

  return (
    <tr className="hover:bg-[var(--Light)] transition-colors">
      {/* Customer Info */}
      <td className="p-4">
        <div className="font-medium text-[var(--Main)]">{booking.name}</div>
        {booking.country && (
          <div className="text-sm text-[var(--SubText)]">{booking.country}</div>
        )}
      </td>

      {/* Contact Info */}
      <td className="p-4">
        <div className="text-[var(--Main)]">{booking.email}</div>
        <div className="text-sm text-[var(--SubText)]">
          {booking.phoneNumber}
        </div>
      </td>

      {/* Package Info */}
      <td className="p-4 text-[var(--SubText)]">
        {`${pkg?.category?.name} — ${pkg?.levelno} Level`} — {pkg?.priceAfter}{" "}
        {"USD"}
      </td>

      {/* Amount */}
      <td className="p-4 font-medium text-[var(--Main)]">
        <div>Total: {formatCurrency(booking.totalPrice || booking.amount, booking.currency)}</div>
        {booking.paymentType === "installment" && (
          <div className="text-xs text-[var(--SubText)]">
            Paid: {formatCurrency(booking.amount, booking.currency)}
            <br />
            Rem: <span className="text-red-500">{formatCurrency(booking.remainingAmount || 0, booking.currency)}</span>
          </div>
        )}
      </td>

      {/* Booking Status */}
      <td className="p-4">
        <span className={getStatusBadge(booking.status)}>
          {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
        </span>
      </td>

      {/* Payment Status */}
      <td className="p-4">
        <span className={getPaymentStatusBadge(booking.paymentStatus)}>
          {booking.paymentStatus?.charAt(0).toUpperCase() +
            booking.paymentStatus?.slice(1)}
        </span>
      </td>

      {/* Payment Method */}
      <td className="p-4 text-sm text-[var(--SubText)]">
        {getPaymentMethodDisplay(booking.paymentMethod)}
      </td>

      {/* Date */}
      <td className="p-4 text-sm text-[var(--SubText)]">
        {formatDate(booking?.paidAt || booking?.createdAt)}
      </td>

      {/* Actions */}
      <td className="p-4">
        <div className="flex space-x-2">
          {booking.paymentStatus === "paid" && (
            <button
              disabled={isRefunding}
              className={`px-2 py-1 text-xs border border-red-200 text-red-600 rounded hover:bg-red-50 ${isRefunding ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Refund Payment"
              onClick={handleRefund}
            >
              {isRefunding ? "..." : "Refund"}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

export default BookingRow;
