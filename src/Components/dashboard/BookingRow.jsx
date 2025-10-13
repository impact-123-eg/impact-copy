import React from "react";

function BookingRow({ booking }) {
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

      {/* Package Info - This would need to be populated from the referenced Package */}
      <td className="p-4 text-[var(--SubText)]">
        {booking.package ? "Package Info" : "N/A"}
      </td>

      {/* Amount */}
      <td className="p-4 font-medium text-[var(--Main)]">
        {formatCurrency(booking.amount, booking.currency)}
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

      {/* Date Created */}
      <td className="p-4 text-sm text-[var(--SubText)]">
        {formatDate(booking.createdAt)}
      </td>

      {/* Actions */}
      <td className="p-4">
        <div className="flex space-x-2">
          <button
            className="p-1 text-blue-600 hover:text-blue-800"
            title="View Details"
          >
            👁️
          </button>
          {/* {booking.paymentStatus === "unpaid" && (
            <button
              className="p-1 text-green-600 hover:text-green-800"
              title="Mark as Paid"
            >
              💰
            </button>
          )}
          {booking.status === "pending" && (
            <button
              className="p-1 text-red-600 hover:text-red-800"
              title="Cancel Booking"
            >
              ❌
            </button>
          )} */}
        </div>
      </td>
    </tr>
  );
}

export default BookingRow;
