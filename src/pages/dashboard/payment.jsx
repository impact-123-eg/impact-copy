import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetAllBookings } from "@/hooks/Actions/booking/useBookingCruds";
import BookingRow from "@/Components/dashboard/BookingRow";

function Payment() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");

  const { data: bookingData, isPending } = useGetAllBookings();
  const bookings = bookingData?.data || [];

  const handleSearchChange = (e) =>
    setSearchQuery(e.target.value.toLowerCase());

  const filteredBookings = bookings?.filter((booking) => {
    const matchesSearch =
      booking?.name?.toLowerCase().includes(searchQuery) ||
      booking?.email?.toLowerCase().includes(searchQuery) ||
      booking?.phoneNumber?.includes(searchQuery);

    const matchesStatus = statusFilter
      ? booking?.status === statusFilter
      : true;
    const matchesPaymentStatus = paymentStatusFilter
      ? booking?.paymentStatus === paymentStatusFilter
      : true;

    return matchesSearch && matchesStatus && matchesPaymentStatus;
  });

  // Get counts for filter badges
  const getStatusCount = (status) =>
    bookings.filter((booking) => booking.status === status).length;

  const getPaymentStatusCount = (paymentStatus) =>
    bookings.filter((booking) => booking.paymentStatus === paymentStatus)
      .length;

  return (
    <main className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl text-[var(--Main)]">
          Package Bookings
        </h1>
        <Link
          to="/dash/payment/manual"
          className="px-4 py-2 bg-[var(--Yellow)] hover:bg-opacity-90 rounded-xl"
        >
          Record Manual Payment
        </Link>
      </div>

      {/* Search and Filter Section */}
      <section className="bg-white p-6 rounded-2xl shadow space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Search Input */}
          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">
              Search Bookings
            </label>
            <div className="relative">
              <input
                type="search"
                placeholder="Search by name, email, or phone"
                className="w-full bg-[var(--Input)] py-3 px-4 pr-10 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <span className="absolute right-3 top-3 text-[var(--SubText)]">
                🔍
              </span>
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">
              Booking Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
            >
              <option value="">All Status ({bookings.length})</option>
              <option value="pending">
                Pending ({getStatusCount("pending")})
              </option>
              <option value="confirmed">
                Confirmed ({getStatusCount("confirmed")})
              </option>
              <option value="cancelled">
                Cancelled ({getStatusCount("cancelled")})
              </option>
              <option value="expired">
                Expired ({getStatusCount("expired")})
              </option>
            </select>
          </div>

          {/* Payment Status Filter */}
          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">
              Payment Status
            </label>
            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
            >
              <option value="">All Payments</option>
              <option value="unpaid">
                Unpaid ({getPaymentStatusCount("unpaid")})
              </option>
              <option value="paid">
                Paid ({getPaymentStatusCount("paid")})
              </option>
              <option value="failed">
                Failed ({getPaymentStatusCount("failed")})
              </option>
              <option value="refunded">
                Refunded ({getPaymentStatusCount("refunded")})
              </option>
            </select>
          </div>

          {/* Payment Method Filter */}
          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">
              Payment Method
            </label>
            <select
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
            >
              <option value="">All Methods</option>
              <option value="card">Card</option>
              <option value="apple">Apple Pay</option>
              <option value="wallet">Wallet</option>
            </select>
          </div>
        </div>
      </section>

      {/* Summary Stats */}
      {!isPending && bookings.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <div className="text-2xl font-bold text-[var(--Main)]">
              {bookings.length}
            </div>
            <div className="text-sm text-[var(--SubText)]">Total Bookings</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <div className="text-2xl font-bold text-green-600">
              {getStatusCount("confirmed")}
            </div>
            <div className="text-sm text-[var(--SubText)]">Confirmed</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <div className="text-2xl font-bold text-blue-600">
              {getPaymentStatusCount("paid")}
            </div>
            <div className="text-sm text-[var(--SubText)]">Paid</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <div className="text-2xl font-bold text-[var(--Yellow)]">
              {bookings.reduce(
                (sum, booking) => sum + (booking.amount || 0),
                0
              )}{" "}
              EGP
            </div>
            <div className="text-sm text-[var(--SubText)]">Total Revenue</div>
          </div>
        </div>
      )}

      {/* Bookings Table */}
      <section className="bg-white rounded-2xl shadow overflow-hidden">
        {isPending ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--Yellow)] mx-auto"></div>
            <p className="mt-4 text-[var(--SubText)]">Loading bookings...</p>
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--Light)]">
                <tr className="text-left text-[var(--SubText)]">
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium">Contact</th>
                  <th className="p-4 font-medium">Package</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Payment</th>
                  <th className="p-4 font-medium">Method</th>
                  <th className="p-4 font-medium">Date</th>
                  {/* <th className="p-4 font-medium">Actions</th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--Light)]">
                {filteredBookings.map((booking) => (
                  <BookingRow key={booking._id} booking={booking} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📦</div>
            <h2 className="text-xl font-semibold text-[var(--Main)] mb-2">
              No Bookings Found
            </h2>
            <p className="text-[var(--SubText)]">
              {searchQuery || statusFilter || paymentStatusFilter
                ? "Try adjusting your search or filters"
                : "No bookings have been made yet"}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default Payment;
