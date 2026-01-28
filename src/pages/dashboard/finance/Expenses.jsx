// pages/dashboard/finance/Expenses.jsx
import { useState } from "react";
import { useGetAllExpenses, useAddExpense, useUpdateExpense, useDeleteExpense, useApproveExpense, useGetExpenseSummary } from "@/hooks/Actions/finance/useFinanceCruds";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import toast from "react-hot-toast";
import { HiPencil, HiTrash, HiPlus, HiCheck } from "react-icons/hi2";
import ConfirmModal from "@/Components/ConfirmModal";

function Expenses() {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    category: "",
    status: "",
    paymentMethod: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  const { data: expensesData, isPending, refetch } = useGetAllExpenses(filters);
  const { data: summaryData } = useGetExpenseSummary(filters);
  const { mutate: addExpense, isPending: isAdding } = useAddExpense();
  const { mutate: updateExpense, isPending: isUpdating } = useUpdateExpense();
  const { mutate: deleteExpense, isPending: isDeleting } = useDeleteExpense();
  const { mutate: approveExpense, isPending: isApproving } = useApproveExpense();

  const expenses = expensesData?.data?.data || [];
  const summary = summaryData?.data?.summary || { totalExpenses: 0, pendingAmount: 0, paidAmount: 0, count: 0 };

  const categoryOptions = [
    { value: "salaries", label: "Salaries" },
    { value: "marketing", label: "Marketing" },
    { value: "software", label: "Software" },
    { value: "equipment", label: "Equipment" },
    { value: "rent", label: "Rent" },
    { value: "utilities", label: "Utilities" },
    { value: "transportation", label: "Transportation" },
    { value: "materials", label: "Materials" },
    { value: "commissions", label: "Commissions" },
    { value: "fees", label: "Fees" },
    { value: "other", label: "Other" },
  ];

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "paid", label: "Paid" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const paymentMethodOptions = [
    { value: "cash", label: "Cash" },
    { value: "bank_transfer", label: "Bank Transfer" },
    { value: "check", label: "Check" },
    { value: "card", label: "Card" },
    { value: "instapay", label: "Instapay" },
    { value: "vodafone_cash", label: "Vodafone Cash" },
    { value: "other", label: "Other" },
  ];

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddClick = () => {
    setEditingExpense({
      amount: "",
      currency: "EGP",
      category: "other",
      description: "",
      paymentMethod: "cash",
      status: "pending",
      transactionDate: new Date().toISOString().split("T")[0],
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (expense) => {
    setEditingExpense({
      ...expense,
      transactionDate: new Date(expense.transactionDate).toISOString().split("T")[0],
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (expense) => {
    setExpenseToDelete(expense);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteExpense({ url: `/api/expenses/${expenseToDelete._id}` });
      toast.success("Expense deleted successfully");
      setDeleteModalOpen(false);
      setExpenseToDelete(null);
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to delete expense");
    }
  };

  const handleApproveClick = async (expense) => {
    try {
      await approveExpense({ url: `/api/expenses/${expense._id}/approve`, data: {} });
      toast.success("Expense approved successfully");
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to approve expense");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...editingExpense,
        transactionDate: new Date(editingExpense.transactionDate),
      };

      if (editingExpense._id) {
        await updateExpense({
          url: `/api/expenses/${editingExpense._id}`,
          data,
        });
        toast.success("Expense updated successfully");
      } else {
        await addExpense({ url: "/api/expenses", data });
        toast.success("Expense added successfully");
      }

      setIsModalOpen(false);
      setEditingExpense(null);
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to save expense");
    }
  };

  return (
    <main className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl text-[var(--Main)]">Expenses Management</h1>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--Yellow)] hover:bg-opacity-90 rounded-xl"
        >
          <HiPlus size={18} />
          Add Expense
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="text-sm text-[var(--SubText)] mb-1">Total Expenses</div>
          <div className="text-2xl font-bold text-red-600">
            {Number(summary.totalExpenses || 0).toFixed(2)} EGP
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="text-sm text-[var(--SubText)] mb-1">Pending</div>
          <div className="text-2xl font-bold text-yellow-600">
            {Number(summary.pendingAmount || 0).toFixed(2)} EGP
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="text-sm text-[var(--SubText)] mb-1">Paid</div>
          <div className="text-2xl font-bold text-green-600">
            {Number(summary.paidAmount || 0).toFixed(2)} EGP
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
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
            <p className="mt-4 text-[var(--SubText)]">Loading expenses...</p>
          </div>
        ) : expenses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--Light)]">
                <tr className="text-left text-[var(--SubText)]">
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Description</th>
                  <th className="p-4 font-medium">Vendor</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Method</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--Light)]">
                {expenses.map((expense) => (
                  <tr key={expense._id} className="hover:bg-gray-50">
                    <td className="p-4">
                      {new Date(expense.transactionDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 capitalize">{expense.category?.replace(/_/g, " ")}</td>
                    <td className="p-4">{expense.description}</td>
                    <td className="p-4">{expense.vendorName || "-"}</td>
                    <td className="p-4 font-semibold text-red-600">
                      {Number(expense.amount).toFixed(2)} {expense.currency}
                    </td>
                    <td className="p-4 capitalize">{expense.paymentMethod?.replace(/_/g, " ")}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        expense.status === "paid" ? "bg-green-100 text-green-800" :
                        expense.status === "approved" ? "bg-blue-100 text-blue-800" :
                        expense.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {expense.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {expense.status === "pending" && (
                          <button
                            onClick={() => handleApproveClick(expense)}
                            disabled={isApproving}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            title="Approve"
                          >
                            <HiCheck size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleEditClick(expense)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <HiPencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(expense)}
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
            <div className="text-4xl mb-4">💸</div>
            <h2 className="text-xl font-semibold text-[var(--Main)] mb-2">No Expenses Found</h2>
            <p className="text-[var(--SubText)]">
              {Object.values(filters).some(v => v) ? "Try adjusting your filters" : "No expenses recorded yet"}
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
          {editingExpense?._id ? "Edit Expense" : "Add Expense"}
        </h2>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--Main)] mb-2">Amount *</label>
              <input
                type="number"
                step="0.01"
                required
                value={editingExpense?.amount || ""}
                onChange={(e) => setEditingExpense(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--Main)] mb-2">Currency</label>
              <select
                value={editingExpense?.currency || "EGP"}
                onChange={(e) => setEditingExpense(prev => ({ ...prev, currency: e.target.value }))}
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
              value={editingExpense?.transactionDate || ""}
              onChange={(e) => setEditingExpense(prev => ({ ...prev, transactionDate: e.target.value }))}
              className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">Category *</label>
            <select
              required
              value={editingExpense?.category || ""}
              onChange={(e) => setEditingExpense(prev => ({ ...prev, category: e.target.value }))}
              className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
            >
              {categoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">Description *</label>
            <input
              type="text"
              required
              value={editingExpense?.description || ""}
              onChange={(e) => setEditingExpense(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">Vendor Name</label>
            <input
              type="text"
              value={editingExpense?.vendorName || ""}
              onChange={(e) => setEditingExpense(prev => ({ ...prev, vendorName: e.target.value }))}
              className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">Payment Method</label>
            <select
              value={editingExpense?.paymentMethod || ""}
              onChange={(e) => setEditingExpense(prev => ({ ...prev, paymentMethod: e.target.value }))}
              className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
            >
              {paymentMethodOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">Reference/Invoice</label>
            <input
              type="text"
              value={editingExpense?.reference || ""}
              onChange={(e) => setEditingExpense(prev => ({ ...prev, reference: e.target.value }))}
              className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">Notes</label>
            <textarea
              value={editingExpense?.notes || ""}
              onChange={(e) => setEditingExpense(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
              rows={2}
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
              {isAdding || isUpdating ? "Saving..." : editingExpense?._id ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Expense"
        description="Are you sure you want to delete this expense entry? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="red"
        icon="delete"
      />
    </main>
  );
}

export default Expenses;
