// hooks/Actions/finance/useFinanceCruds.jsx
import endPoints from "@/config/endPoints";
import queryKeys from "@/config/queryKeys";
import useDeleteData from "@/hooks/curdsHook/useDeleteData";
import useGetData from "@/hooks/curdsHook/useGetData";
import usePatchData from "@/hooks/curdsHook/usePatchData";
import usePostData from "@/hooks/curdsHook/usePostData";

// ==================== REVENUE HOOKS ====================

export const useGetAllRevenues = (params = {}) => {
  const { page = 1, limit = 50, ...otherParams } = params;
  const queryString = new URLSearchParams({ page, limit, ...otherParams }).toString();

  const { data, isPending, refetch, ...rest } = useGetData({
    url: `${endPoints.revenues}?${queryString}`,
    queryKeys: [queryKeys.revenues, page, limit, JSON.stringify(otherParams)],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};

export const useGetRevenueSummary = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();

  const { data, isPending, refetch } = useGetData({
    url: `${endPoints.revenuesSummary}?${queryString}`,
    queryKeys: [queryKeys.revenuesSummary, JSON.stringify(params)],
  });

  return { data, isPending, refetch };
};

export const useGetRevenueById = ({ id, enabled }) => {
  const { data, isPending, isSuccess, refetch } = useGetData({
    url: `${endPoints.revenues}/${id}`,
    queryKeys: [queryKeys.revenues, id],
    enabled: enabled,
  });

  return { data, isPending, isSuccess, refetch };
};

export const useAddRevenue = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.revenues,
    [queryKeys.revenues],
    [queryKeys.revenues]
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useUpdateRevenue = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePatchData(
    endPoints.revenues,
    [queryKeys.revenues],
    [queryKeys.revenues]
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useDeleteRevenue = () => {
  const { mutate, isPending, isSuccess } = useDeleteData(
    endPoints.revenues,
    [queryKeys.revenues],
    [queryKeys.revenues]
  );
  return { mutate, isPending, isSuccess };
};

// ==================== EXPENSE HOOKS ====================

export const useGetAllExpenses = (params = {}) => {
  const { page = 1, limit = 50, ...otherParams } = params;
  const queryString = new URLSearchParams({ page, limit, ...otherParams }).toString();

  const { data, isPending, refetch, ...rest } = useGetData({
    url: `${endPoints.expenses}?${queryString}`,
    queryKeys: [queryKeys.expenses, page, limit, JSON.stringify(otherParams)],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};

export const useGetExpenseSummary = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();

  const { data, isPending, refetch } = useGetData({
    url: `${endPoints.expensesSummary}?${queryString}`,
    queryKeys: [queryKeys.expensesSummary, JSON.stringify(params)],
  });

  return { data, isPending, refetch };
};

export const useGetExpenseById = ({ id, enabled }) => {
  const { data, isPending, isSuccess, refetch } = useGetData({
    url: `${endPoints.expenses}/${id}`,
    queryKeys: [queryKeys.expenses, id],
    enabled: enabled,
  });

  return { data, isPending, isSuccess, refetch };
};

export const useAddExpense = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.expenses,
    [queryKeys.expenses],
    [queryKeys.expenses]
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useUpdateExpense = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePatchData(
    endPoints.expenses,
    [queryKeys.expenses],
    [queryKeys.expenses]
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useDeleteExpense = () => {
  const { mutate, isPending, isSuccess } = useDeleteData(
    endPoints.expenses,
    [queryKeys.expenses],
    [queryKeys.expenses]
  );
  return { mutate, isPending, isSuccess };
};

export const useApproveExpense = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.expenses,
    [queryKeys.expenses],
    [queryKeys.expenses]
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

// ==================== PAYROLL HOOKS ====================

export const useGetAllPayrolls = (params = {}) => {
  const { page = 1, limit = 50, ...otherParams } = params;
  const queryString = new URLSearchParams({ page, limit, ...otherParams }).toString();

  const { data, isPending, refetch, ...rest } = useGetData({
    url: `${endPoints.payroll}?${queryString}`,
    queryKeys: [queryKeys.payroll, page, limit, JSON.stringify(otherParams)],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};

export const useGetPayrollSummary = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();

  const { data, isPending, refetch } = useGetData({
    url: `${endPoints.payrollSummary}?${queryString}`,
    queryKeys: [queryKeys.payrollSummary, JSON.stringify(params)],
  });

  return { data, isPending, refetch };
};

export const useGetPayrollById = ({ id, enabled }) => {
  const { data, isPending, isSuccess, refetch } = useGetData({
    url: `${endPoints.payroll}/${id}`,
    queryKeys: [queryKeys.payroll, id],
    enabled: enabled,
  });

  return { data, isPending, isSuccess, refetch };
};

export const useGetInstructorsForPayroll = () => {
  const { data, isPending } = useGetData({
    url: endPoints.payrollInstructors,
    queryKeys: [queryKeys.payroll, "instructors"],
  });

  return { data, isPending };
};

export const useAddPayroll = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.payroll,
    [queryKeys.payroll],
    [queryKeys.payroll]
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useCalculatePayroll = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    `${endPoints.payroll}/calculate`,
    [queryKeys.payroll, "calculate"],
    [queryKeys.payroll]
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useUpdatePayroll = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePatchData(
    endPoints.payroll,
    [queryKeys.payroll],
    [queryKeys.payroll]
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useDeletePayroll = () => {
  const { mutate, isPending, isSuccess } = useDeleteData(
    endPoints.payroll,
    [queryKeys.payroll],
    [queryKeys.payroll]
  );
  return { mutate, isPending, isSuccess };
};

export const useApprovePayroll = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.payroll,
    [queryKeys.payroll],
    [queryKeys.payroll]
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useMarkPayrollAsPaid = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.payroll,
    [queryKeys.payroll],
    [queryKeys.payroll]
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

// ==================== FINANCE SUMMARY HOOK ====================

export const useGetFinanceSummary = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();

  const { data, isPending, refetch } = useGetData({
    url: `${endPoints.financeSummary}?${queryString}`,
    queryKeys: [queryKeys.financeSummary, JSON.stringify(params)],
  });

  return { data, isPending, refetch };
};
