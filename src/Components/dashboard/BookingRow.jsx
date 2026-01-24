import { useState } from "react";
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
import InlineSelect from "@/Components/ui/InlineSelect";
import { useUpdateBooking } from "@/hooks/Actions/booking/useBookingCruds";
import { MoreHorizontal, Edit2, RotateCcw } from "lucide-react";
import EditAmountModal from "./EditAmountModal";

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "expired", label: "Expired" },
];

const paymentMethodOptions = [
  { value: "card", label: "Card" },
  { value: "apple", label: "Apple Pay" },
  { value: "taptap_send", label: "TapTap Send" },
  { value: "bank_account", label: "Bank Account" },
  { value: "instapay", label: "Instapay" },
  { value: "vodafone_cash", label: "Vodafone Cash" },
  { value: "western", label: "Western Union" },
  { value: "paypal", label: "PayPal" },
];

function BookingRow({ booking }) {
  const pkg = booking?.package;
  const [isAmountModalOpen, setIsAmountModalOpen] = useState(false);

  const { mutate: updateMutate, isPending: isUpdating } = useUpdateBooking();

  const { mutate: refundMutate, isPending: isRefunding } = usePostData(
    `${endPoints.bookings}${booking._id}/refund`,
    [`refundBooking-${booking._id}`],
    ["bookings"] // Invalidate main bookings list
  );

  const handleRefund = () => {
    if (
      window.confirm(
        `Are you sure you want to refund ${booking.name}? This action cannot be undone.`
      )
    ) {
      refundMutate({ data: {} });
    }
  };

  const handleStatusChange = (newStatus) => {
    updateMutate({ data: { status: newStatus }, id: booking._id });
  };

  const handlePaymentMethodChange = (newMethod) => {
    updateMutate({ data: { paymentMethod: newMethod }, id: booking._id });
  };

  const handleEditPayment = () => {
    setIsAmountModalOpen(true);
  };

  const handleConfirmAmount = (newVal) => {
    if (newVal !== null && !isNaN(newVal)) {
      updateMutate({
        data: { amount: Number(newVal) },
        id: booking._id,
      });
    }
  };

  const actionOptions = [
    ...(booking.paymentStatus === "paid"
      ? [{ value: "refund", label: "Refund", icon: RotateCcw }]
      : []),
    { value: "edit_payment", label: "Edit Payment", icon: Edit2 },
  ];

  const handleAction = (val) => {
    if (val === "refund") handleRefund();
    if (val === "edit_payment") handleEditPayment();
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
      <td className="p-4 min-w-[150px]">
        <InlineSelect
          value={booking.status}
          onChange={handleStatusChange}
          options={statusOptions}
          isLoading={isUpdating}
          className="text-xs"
        />
      </td>

      {/* Payment Status */}
      <td className="p-4">
        <span className={getPaymentStatusBadge(booking.paymentStatus)}>
          {booking.paymentStatus?.charAt(0).toUpperCase() +
            booking.paymentStatus?.slice(1)}
        </span>
      </td>

      {/* Payment Method */}
      <td className="p-4 min-w-[150px]">
        <InlineSelect
          value={booking.paymentMethod}
          onChange={handlePaymentMethodChange}
          options={paymentMethodOptions}
          isLoading={isUpdating}
          className="text-xs"
        />
      </td>

      {/* Date */}
      <td className="p-4 text-sm text-[var(--SubText)]">
        {formatDate(booking?.paidAt || booking?.createdAt)}
      </td>

      {/* Actions */}
      <td className="p-4">
        <InlineSelect
          placeholder="Actions"
          options={actionOptions}
          onChange={handleAction}
          isLoading={isRefunding || isUpdating}
          className="text-xs"
        />
        <EditAmountModal
          isOpen={isAmountModalOpen}
          onClose={() => setIsAmountModalOpen(false)}
          onConfirm={handleConfirmAmount}
          booking={booking}
        />
      </td>
    </tr>
  );
}

export default BookingRow;
