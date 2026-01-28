// pages/dashboard/finance/Payroll.jsx
import { useState, useEffect } from "react";
import { useGetAllPayrolls, useAddPayroll, useUpdatePayroll, useDeletePayroll, useApprovePayroll, useMarkPayrollAsPaid, useGetPayrollSummary, useGetInstructorsForPayroll, useCalculatePayroll } from "@/hooks/Actions/finance/useFinanceCruds";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import toast from "react-hot-toast";
import { HiPencil, HiTrash, HiPlus, HiCheck, HiCalculator, HiCurrencyDollar } from "react-icons/hi2";
import ConfirmModal from "@/Components/ConfirmModal";

function Payroll() {
  const [filters, setFilters] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    instructorId: "",
    status: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCalculateModalOpen, setIsCalculateModalOpen] = useState(false);
  const [editingPayroll, setEditingPayroll] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [payrollToDelete, setPayrollToDelete] = useState(null);
  const [calculateData, setCalculateData] = useState({
    instructorId: "",
    periodStart: "",
    periodEnd: "",
    hourlyRate: "",
  });

  const { data: payrollsData, isPending, refetch } = useGetAllPayrolls(filters);
  const { data: summaryData } = useGetPayrollSummary(filters);
  const { data: instructorsData, isPending: instructorsPending } = useGetInstructorsForPayroll();
  const { mutate: addPayroll, isPending: isAdding } = useAddPayroll();
  const { mutate: updatePayroll, isPending: isUpdating } = useUpdatePayroll();
  const { mutate: deletePayroll, isPending: isDeleting } = useDeletePayroll();
  const { mutate: approvePayroll, isPending: isApproving } = useApprovePayroll();
  const { mutate: markPaid, isPending: isMarkingPaid } = useMarkPayrollAsPaid();
  const { mutate: calculatePayroll, isPending: isCalculating } = useCalculatePayroll();

  // Auto-fill total hours when instructor and period are selected
  useEffect(() => {
    if (editingPayroll?._id) return; // Skip for existing payrolls

    const { instructor, periodStart, periodEnd } = editingPayroll || {};

    if (instructor && periodStart && periodEnd) {
      const timeoutId = setTimeout(() => {
        calculatePayroll({
          url: "/api/payroll/calculate",
          data: {
            instructorId: instructor,
            periodStart,
            periodEnd,
            hourlyRate: editingPayroll.hourlyRate || 0,
          },
        }, {
          onSuccess: (response) => {
            const result = response.data;
            setEditingPayroll((prev) => ({
              ...prev,
              totalHours: result.totalHours,
              baseSalary: result.baseSalary,
              grossSalary: result.grossSalary,
              netSalary: result.netSalary,
              sessions: result.sessions,
              calculationMethod: "automatic",
            }));
            toast.success("Hours calculated successfully");
          },
          onError: () => {
            // Slient fail or custom toast? User might be typing date. 
            // Better not to spam errors if just date is invalid or partial.
          }
        });
      }, 800); // 800ms debounce

      return () => clearTimeout(timeoutId);
    }
  }, [editingPayroll?.instructor, editingPayroll?.periodStart, editingPayroll?.periodEnd]);


  const payrolls = payrollsData?.data?.data || [];
  const summary = summaryData?.data?.summary || { totalGross: 0, totalNet: 0, paidAmount: 0, pendingAmount: 0, count: 0 };
  const instructors = instructorsData?.data || [];

  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "pending_approval", label: "Pending Approval" },
    { value: "approved", label: "Approved" },
    { value: "paid", label: "Paid" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddClick = () => {
    setEditingPayroll({
      instructor: "",
      periodStart: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0],
      periodEnd: new Date().toISOString().split("T")[0],
      hourlyRate: "",
      totalHours: 0,
      baseSalary: 0,
      totalAdjustments: 0,
      grossSalary: 0,
      deductions: 0,
      netSalary: 0,
      status: "draft",
      calculationMethod: "manual",
      sessions: [],
      adjustments: [],
    });
    setIsModalOpen(true);
  };

  const handleCalculateClick = () => {
    setCalculateData({
      instructorId: "",
      periodStart: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0],
      periodEnd: new Date().toISOString().split("T")[0],
      hourlyRate: "",
    });
    setIsCalculateModalOpen(true);
  };

  const handleCalculateSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await calculatePayroll({
        url: "/api/payroll/calculate",
        data: calculateData,
      });

      // Open the modal with the calculated data
      setEditingPayroll({
        ...result.data,
        status: "draft",
        calculationMethod: "automatic",
      });
      setIsCalculateModalOpen(false);
      setIsModalOpen(true);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to calculate payroll");
    }
  };

  const handleEditClick = (payroll) => {
    setEditingPayroll({
      ...payroll,
      periodStart: new Date(payroll.periodStart).toISOString().split("T")[0],
      periodEnd: new Date(payroll.periodEnd).toISOString().split("T")[0],
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (payroll) => {
    setPayrollToDelete(payroll);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deletePayroll({ url: `/api/payroll/${payrollToDelete._id}` });
      toast.success("Payroll deleted successfully");
      setDeleteModalOpen(false);
      setPayrollToDelete(null);
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to delete payroll");
    }
  };

  const handleApproveClick = async (payroll) => {
    try {
      await approvePayroll({ url: `/api/payroll/${payroll._id}/approve`, data: {} });
      toast.success("Payroll approved successfully");
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to approve payroll");
    }
  };

  const handleMarkPaidClick = async (payroll) => {
    try {
      await markPaid({
        url: `/api/payroll/${payroll._id}/mark-paid`,
        data: { paymentMethod: "bank_transfer", paymentReference: "" },
      });
      toast.success("Payroll marked as paid successfully");
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to mark as paid");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...editingPayroll,
        periodStart: new Date(editingPayroll.periodStart),
        periodEnd: new Date(editingPayroll.periodEnd),
      };

      if (editingPayroll._id) {
        await updatePayroll({
          url: `/api/payroll/${editingPayroll._id}`,
          data,
        });
        toast.success("Payroll updated successfully");
      } else {
        await addPayroll({ url: "/api/payroll", data });
        toast.success("Payroll added successfully");
      }

      setIsModalOpen(false);
      setEditingPayroll(null);
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to save payroll");
    }
  };

  const instructorName = (instructorId) => {
    const instructor = instructors.find((i) => i._id === instructorId);
    return instructor?.name || "Unknown";
  };

  return (
    <main className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl text-[var(--Main)]">Payroll Management</h1>
        <div className="flex gap-3">
          <button
            onClick={handleCalculateClick}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-opacity-90 text-white rounded-xl"
          >
            <HiCalculator size={18} />
            Auto Calculate
          </button>
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--Yellow)] hover:bg-opacity-90 rounded-xl"
          >
            <HiPlus size={18} />
            Add Payroll
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="text-sm text-[var(--SubText)] mb-1">Total Gross</div>
          <div className="text-2xl font-bold text-[var(--Main)]">
            {Number(summary.totalGross || 0).toFixed(2)} EGP
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="text-sm text-[var(--SubText)] mb-1">Total Net</div>
          <div className="text-2xl font-bold text-blue-600">
            {Number(summary.totalNet || 0).toFixed(2)} EGP
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="text-sm text-[var(--SubText)] mb-1">Paid</div>
          <div className="text-2xl font-bold text-green-600">
            {Number(summary.paidAmount || 0).toFixed(2)} EGP
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="text-sm text-[var(--SubText)] mb-1">Pending</div>
          <div className="text-2xl font-bold text-yellow-600">
            {Number(summary.pendingAmount || 0).toFixed(2)} EGP
          </div>
        </div>
      </div>

      {/* Filters */}
      <section className="bg-white p-6 rounded-2xl shadow">
        <h3 className="font-semibold text-[var(--Main)] mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">Employee</label>
            <select
              value={filters.instructorId}
              onChange={(e) => handleFilterChange("instructorId", e.target.value)}
              className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
            >
              <option value="">All Employees</option>
              {instructors.map((inst) => (
                <option key={inst._id} value={inst._id}>{inst.name}</option>
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
        </div>
      </section>

      {/* Table */}
      <section className="bg-white rounded-2xl shadow overflow-hidden">
        {isPending ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--Yellow)] mx-auto"></div>
            <p className="mt-4 text-[var(--SubText)]">Loading payrolls...</p>
          </div>
        ) : payrolls.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--Light)]">
                <tr className="text-left text-[var(--SubText)]">
                  <th className="p-4 font-medium">Period</th>
                  <th className="p-4 font-medium">Employee</th>
                  <th className="p-4 font-medium">Hours</th>
                  <th className="p-4 font-medium">Hourly Rate</th>
                  <th className="p-4 font-medium">Gross</th>
                  <th className="p-4 font-medium">Deductions</th>
                  <th className="p-4 font-medium">Net Salary</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--Light)]">
                {payrolls.map((payroll) => (
                  <tr key={payroll._id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="text-sm">
                        {new Date(payroll.periodStart).toLocaleDateString()} - {new Date(payroll.periodEnd).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      {instructorName(payroll.instructor)}
                    </td>
                    <td className="p-4">
                      {payroll.totalHours || 0}h
                    </td>
                    <td className="p-4">
                      {Number(payroll.hourlyRate || 0).toFixed(2)}
                    </td>
                    <td className="p-4 font-semibold text-[var(--Main)]">
                      {Number(payroll.grossSalary || 0).toFixed(2)} EGP
                    </td>
                    <td className="p-4 text-red-600">
                      {Number(payroll.deductions || 0).toFixed(2)} EGP
                    </td>
                    <td className="p-4 font-semibold text-blue-600">
                      {Number(payroll.netSalary || 0).toFixed(2)} EGP
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${payroll.status === "paid" ? "bg-green-100 text-green-800" :
                        payroll.status === "approved" ? "bg-blue-100 text-blue-800" :
                          payroll.status === "pending_approval" ? "bg-yellow-100 text-yellow-800" :
                            "bg-gray-100 text-gray-800"
                        }`}>
                        {payroll.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {payroll.status === "draft" && (
                          <button
                            onClick={() => handleApproveClick(payroll)}
                            disabled={isApproving}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            title="Approve"
                          >
                            <HiCheck size={16} />
                          </button>
                        )}
                        {payroll.status === "approved" && (
                          <button
                            onClick={() => handleMarkPaidClick(payroll)}
                            disabled={isMarkingPaid}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Mark as Paid"
                          >
                            <HiCurrencyDollar size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleEditClick(payroll)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <HiPencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(payroll)}
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
            <div className="text-4xl mb-4">💵</div>
            <h2 className="text-xl font-semibold text-[var(--Main)] mb-2">No Payroll Records Found</h2>
            <p className="text-[var(--SubText)]">
              {Object.values(filters).some(v => v) ? "Try adjusting your filters" : "No payroll records yet. Calculate or add one."}
            </p>
          </div>
        )}
      </section>

      {/* Calculate Modal */}
      <Modal
        open={isCalculateModalOpen}
        onClose={() => setIsCalculateModalOpen(false)}
        center
        classNames={{
          modal: "rounded-2xl p-6 max-w-lg w-full mx-4",
          overlay: "bg-black bg-opacity-50",
        }}
      >
        <h2 className="text-xl font-bold text-[var(--Main)] mb-4">Calculate Payroll</h2>
        <form onSubmit={handleCalculateSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">Employee *</label>
            <select
              required
              value={calculateData.instructorId}
              onChange={(e) => {
                const selectedUser = instructors.find(i => i._id === e.target.value);
                setCalculateData(prev => ({
                  ...prev,
                  instructorId: e.target.value,
                  hourlyRate: selectedUser?.hourlyRate || ""
                }));
              }}
              className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
            >
              <option value="">Select Employee</option>
              {instructors.map((inst) => (
                <option key={inst._id} value={inst._id}>{inst.name} ({inst.role})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--Main)] mb-2">Period Start *</label>
              <input
                type="date"
                required
                value={calculateData.periodStart}
                onChange={(e) => setCalculateData(prev => ({ ...prev, periodStart: e.target.value }))}
                className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--Main)] mb-2">Period End *</label>
              <input
                type="date"
                required
                value={calculateData.periodEnd}
                onChange={(e) => setCalculateData(prev => ({ ...prev, periodEnd: e.target.value }))}
                className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">Hourly Rate *</label>
            <input
              type="number"
              step="0.01"
              required
              value={calculateData.hourlyRate}
              onChange={(e) => setCalculateData(prev => ({ ...prev, hourlyRate: e.target.value }))}
              className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsCalculateModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCalculating}
              className="px-4 py-2 bg-blue-500 hover:bg-opacity-90 text-white rounded-xl disabled:opacity-50"
            >
              {isCalculating ? "Calculating..." : "Calculate"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add/Edit Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        center
        classNames={{
          modal: "rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto",
          overlay: "bg-black bg-opacity-50",
        }}
      >
        <h2 className="text-xl font-bold text-[var(--Main)] mb-4">
          {editingPayroll?._id ? "Edit Payroll" : "Add Payroll"}
        </h2>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">Employee *</label>
            <select
              required
              value={editingPayroll?.instructor || ""}
              onChange={(e) => {
                const selectedUser = instructors.find(i => i._id === e.target.value);
                const rate = selectedUser?.hourlyRate || 0;
                setEditingPayroll(prev => ({
                  ...prev,
                  instructor: e.target.value,
                  hourlyRate: rate,
                  baseSalary: (prev?.totalHours || 0) * rate,
                  grossSalary: ((prev?.totalHours || 0) * rate) + (prev?.totalAdjustments || 0),
                  netSalary: ((prev?.totalHours || 0) * rate) + (prev?.totalAdjustments || 0) - (prev?.deductions || 0)
                }));
              }}
              className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
            >
              <option value="">Select Employee</option>
              {instructors.map((inst) => (
                <option key={inst._id} value={inst._id}>{inst.name} ({inst.role})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--Main)] mb-2">Period Start *</label>
              <input
                type="date"
                required
                value={editingPayroll?.periodStart || ""}
                onChange={(e) => setEditingPayroll(prev => ({ ...prev, periodStart: e.target.value }))}
                className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--Main)] mb-2">Period End *</label>
              <input
                type="date"
                required
                value={editingPayroll?.periodEnd || ""}
                onChange={(e) => setEditingPayroll(prev => ({ ...prev, periodEnd: e.target.value }))}
                className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--Main)] mb-2">Hourly Rate *</label>
              <input
                type="number"
                step="0.01"
                required
                value={editingPayroll?.hourlyRate || ""}
                onChange={(e) => setEditingPayroll(prev => ({ ...prev, hourlyRate: parseFloat(e.target.value) }))}
                className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--Main)] mb-2">Total Hours</label>
              <input
                type="number"
                step="0.5"
                value={editingPayroll?.totalHours || 0}
                onChange={(e) => {
                  const hours = parseFloat(e.target.value) || 0;
                  const rate = editingPayroll?.hourlyRate || 0;
                  setEditingPayroll(prev => ({
                    ...prev,
                    totalHours: hours,
                    baseSalary: hours * rate,
                    grossSalary: hours * rate + (prev?.totalAdjustments || 0),
                    netSalary: hours * rate + (prev?.totalAdjustments || 0) - (prev?.deductions || 0),
                  }));
                }}
                className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--Main)] mb-2">Base Salary</label>
              <input
                type="number"
                step="0.01"
                value={editingPayroll?.baseSalary || 0}
                onChange={(e) => setEditingPayroll(prev => ({ ...prev, baseSalary: parseFloat(e.target.value) }))}
                className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
                readOnly
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--Main)] mb-2">Adjustments (+/-)</label>
              <input
                type="number"
                step="0.01"
                value={editingPayroll?.totalAdjustments || 0}
                onChange={(e) => {
                  const adjustments = parseFloat(e.target.value) || 0;
                  const base = editingPayroll?.baseSalary || 0;
                  const deductions = editingPayroll?.deductions || 0;
                  setEditingPayroll(prev => ({
                    ...prev,
                    totalAdjustments: adjustments,
                    grossSalary: base + adjustments,
                    netSalary: base + adjustments - deductions,
                  }));
                }}
                className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--Main)] mb-2">Deductions</label>
              <input
                type="number"
                step="0.01"
                value={editingPayroll?.deductions || 0}
                onChange={(e) => {
                  const deductions = parseFloat(e.target.value) || 0;
                  const gross = editingPayroll?.grossSalary || 0;
                  setEditingPayroll(prev => ({
                    ...prev,
                    deductions: deductions,
                    netSalary: gross - deductions,
                  }));
                }}
                className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
            <div>
              <label className="block text-sm font-medium text-[var(--SubText)] mb-1">Gross Salary</label>
              <div className="text-lg font-bold text-[var(--Main)]">
                {Number(editingPayroll?.grossSalary || 0).toFixed(2)} EGP
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--SubText)] mb-1">Net Salary</label>
              <div className="text-lg font-bold text-blue-600">
                {Number(editingPayroll?.netSalary || 0).toFixed(2)} EGP
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">Status</label>
            <select
              value={editingPayroll?.status || "draft"}
              onChange={(e) => setEditingPayroll(prev => ({ ...prev, status: e.target.value }))}
              className="w-full bg-[var(--Input)] py-3 px-4 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--Yellow)]"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--Main)] mb-2">Notes</label>
            <textarea
              value={editingPayroll?.notes || ""}
              onChange={(e) => setEditingPayroll(prev => ({ ...prev, notes: e.target.value }))}
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
              {isAdding || isUpdating ? "Saving..." : editingPayroll?._id ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Payroll"
        description="Are you sure you want to delete this payroll entry? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="red"
        icon="delete"
      />
    </main>
  );
}

export default Payroll;
