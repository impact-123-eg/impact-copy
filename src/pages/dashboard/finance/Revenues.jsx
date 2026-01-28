// pages/dashboard/finance/Revenues.jsx
import { useState } from "react";
import { useGetAllRevenues, useAddRevenue, useUpdateRevenue, useDeleteRevenue, useGetRevenueSummary } from "@/hooks/Actions/finance/useFinanceCruds";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import toast from "react-hot-toast";
import { HiPencil, HiTrash, HiPlus } from "react-icons/hi2";
import ConfirmModal from "@/Components/ConfirmModal";

function Revenues() {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    source: "",
    status: "",
    category: "",
    paymentMethod: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRevenue, setEditingRevenue] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [revenueToDelete, setRevenueToDelete] = useState(null);

  const { data: revenuesData, isPending, refetch } = useGetAllRevenues(filters);
  const { data: summaryData } = useGetRevenueSummary(filters);
  const { mutate: addRevenue, isPending: isAdding } = useAddRevenue();
  const { mutate: updateRevenue, isPending: isUpdating } = useUpdateRevenue();
  const { mutate: deleteRevenue, isPending: isDeleting } = useDeleteRevenue();

  const revenues = revenuesData?.data?.data || [];
  const summary = summaryData?.data?.summary || { totalRevenue: 0, totalRefunds: 0, netRevenue: 0, count: 0 };

  const sourceOptions = [
    { value: "course_subscription", label: "Course Subscription" },
    { value: "manual", label: "Manual Entry" },
    { value: "affiliate", label: "Affiliate" },
    { value: "other", label: "Other" },
  ];

  const statusOptions = [
    { value: "confirmed", label: "Confirmed" },
    { value: "pending", label: "Pending" },
    { value: "cancelled", label: "Cancelled" },
    { value: "refunded", label: "Refunded" },
  ];

  const categoryOptions = [
    { value: "tuition", label: "Tuition" },
    { value: "material", label: "Material" },
    { value: "exam", label: "Exam" },
    { value: "certificate", label: "Certificate" },
    { value: "other", label: "Other" },
  ];

  const paymentMethodOptions = [
    { value: "card", label: "Card" },
    { value: "apple", label: "Apple Pay" },
    { value: "wallet", label: "Wallet" },
    { value: "manual", label: "Manual" },
    { value: "taptap_send", label: "TapTap Send" },
    { value: "bank_account", label: "Bank Account" },
    { value: "instapay", label: "Instapay" },
    { value: "vodafone_cash", label: "Vodafone Cash" },
    { value: "western", label: "Western Union" },
    { value: "paypal", label: "PayPal" },
    { value: "cash", label: "Cash" },
  ];

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddClick = () => {
    setEditingRevenue({
      source: "manual",
      amount: "",
      currency: "EGP",
      description: "",
      category: "tuition",
      paymentMethod: "cash",
      status: "confirmed",
      transactionDate: new Date().toISOString().split("T")[0],
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (revenue) => {
    setEditingRevenue({
      ...revenue,
      transactionDate: new Date(revenue.transactionDate).toISOString().split("T")[0],
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (revenue) => {
    setRevenueToDelete(revenue);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteRevenue({ url: `/api/finance/revenues/${revenueToDelete._id}` });
      toast.success("Revenue deleted successfully");
      setDeleteModalOpen(false);
      setRevenueToDelete(null);
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to delete revenue");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...editingRevenue,
        transactionDate: new Date(editingRevenue.transactionDate),
      };

      if (editingRevenue._id) {
        await updateRevenue({
          url: `/api/finance/revenues/${editingRevenue._id}`,
          data,
        });
        toast.success("Revenue updated successfully");
      } else {
        await addRevenue({ url: "/api/finance/revenues", data });
        toast.success("Revenue added successfully");
      }

      setIsModalOpen(false);
      setEditingRevenue(null);
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to save revenue");
    }
  };

  return (
    <main className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl text-[var(--Main)]">Revenues Management</h1>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--Yellow)] hover:bg-opacity-90 rounded-xl"
        >
          <HiPlus size={18} />
          Add Revenue
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="text-sm text-[var(--SubText)] mb-1">Total Revenue</div>
          <div className="text-2xl font-bold text-[var(--Main)]">
            {Number(summary.totalRevenue || 0).toFixed(2)} EGP
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="text-sm text-[var(--SubText)] mb-1">Total Refunds</div>
          <div className="text-2xl font-bold text-red-600">
            {Number(summary.totalRefunds || 0).toFixed(2)} EGP
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="text-sm text-[var(--SubText)] mb-1">Net Revenue</div>
          <div className="text-2xl font-bold text-green-600">
            {Number(summary.netRevenue || 0).toFixed(2)} EGP
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="text-sm text-[var(--SubText)] mb-1">Total Entries</div>
          <div className="text-2xl font-bold text-[var(--Main)]">
            {summary.count || 0}
          </div>
        </div>
      </div>

      {/* Filters */}
      <section className="bg-white p-6 rounded-2xl shadow">
        <h3 className="font-semibold text-[var(--Main)] mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">Source</label>
            <select
              value={filters.source}
              onChange={(e) => handleFilterChange("source", e.target.value)}
              className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
            >
              <option value="">All Sources</option>
              {sourceOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
            >
              <option value="">All Status</option>
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
            >
              <option value="">All Categories</option>
              {categoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">Payment Method</label>
            <select
              value={filters.paymentMethod}
              onChange={(e) => handleFilterChange("paymentMethod", e.target.value)}
              className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
            >
              <option value="">All Methods</option>
              {paymentMethodOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Table */}
      <section className="bg-white rounded-2xl shadow overflow-hidden">
        {isPending ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--Yellow)] mx-auto"></div>
            <p className="mt-4 text-[var(--SubText)]">Loading revenues...</p>
          </div>
        ) : revenues.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--Light)]">
                <tr className="text-left text-[var(--SubText)]">
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Source</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Description</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Method</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--Light)]">
                {revenues.map((revenue) => (
                  <tr key={revenue._id} className="hover:bg-gray-50">
                    <td className="p-4">
                      {new Date(revenue.transactionDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 capitalize">{revenue.source?.replace(/_/g, " ")}</td>
                    <td className="p-4 capitalize">{revenue.category}</td>
                    <td className="p-4">{revenue.description || "-"}</td>
                    <td className="p-4 font-semibold text-[var(--Main)]">
                      {Number(revenue.amount).toFixed(2)} {revenue.currency}
                    </td>
                    <td className="p-4 capitalize">{revenue.paymentMethod?.replace(/_/g, " ")}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        revenue.status === "confirmed" ? "bg-green-100 text-green-800" :
                        revenue.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                        revenue.status === "refunded" ? "bg-red-100 text-red-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {revenue.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditClick(revenue)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <HiPencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(revenue)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <HiTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">💰</div>
            <h2 className="text-xl font-semibold text-[var(--Main)] mb-2">No Revenues Found</h2>
            <p className="text-[var(--SubText)]">
              {Object.values(filters).some(v => v) ? "Try adjusting your filters" : "No revenues recorded yet"}
            </p>
          </div>
        )}
      </section>

      {/* Add/Edit Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        center
        classNames={{
          modal: "rounded-2xl p-6 max-w-lg w-full mx-4",
          overlay: "bg-black bg-opacity-50",
        }}
      >
        <h2 className="text-xl font-bold text-[var(--Main)] mb-4">
          {editingRevenue?._id ? "Edit Revenue" : "Add Revenue"}
        </h2>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--Main)] mb-2">Amount *</label>
              <input
                type="number"
                step="0.01"
                required
                value={editingRevenue?.amount || ""}
                onChange={(e) => setEditingRevenue(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--Main)] mb-2">Currency</label>
              <select
                value={editingRevenue?.currency || "EGP"}
                onChange={(e) => setEditingRevenue(prev => ({ ...prev, currency: e.target.value }))}
                className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
              >
                <option value="EGP">EGP</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">Transaction Date *</label>
            <input
              type="date"
              required
              value={editingRevenue?.transactionDate || ""}
              onChange={(e) => setEditingRevenue(prev => ({ ...prev, transactionDate: e.target.value }))}
              className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">Source *</label>
            <select
              required
              value={editingRevenue?.source || ""}
              onChange={(e) => setEditingRevenue(prev => ({ ...prev, source: e.target.value }))}
              className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
            >
              {sourceOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">Category *</label>
            <select
              required
              value={editingRevenue?.category || ""}
              onChange={(e) => setEditingRevenue(prev => ({ ...prev, category: e.target.value }))}
              className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
            >
              {categoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">Payment Method</label>
            <select
              value={editingRevenue?.paymentMethod || ""}
              onChange={(e) => setEditingRevenue(prev => ({ ...prev, paymentMethod: e.target.value }))}
              className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
            >
              {paymentMethodOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">Description</label>
            <textarea
              value={editingRevenue?.description || ""}
              onChange={(e) => setEditingRevenue(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">Reference (Optional)</label>
            <input
              type="text"
              value={editingRevenue?.reference || ""}
              onChange={(e) => setEditingRevenue(prev => ({ ...prev, reference: e.target.value }))}
              className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isAdding || isUpdating}
              className="px-4 py-2 bg-[var(--Yellow)] hover:bg-opacity-90 rounded-xl disabled:opacity-50"
            >
              {isAdding || isUpdating ? "Saving..." : editingRevenue?._id ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Revenue"
        description="Are you sure you want to delete this revenue entry? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="red"
        icon="delete"
      />
    </main>
  );
}

export default Revenues;
