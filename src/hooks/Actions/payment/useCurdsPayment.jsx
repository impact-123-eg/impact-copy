import endPoints from "@/config/endPoints";
import queryKeys from "@/config/queryKeys";
import useGetData from "@/hooks/curdsHook/useGetData";
import usePostData from "@/hooks/curdsHook/usePostData";

export const useChargeWallet = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.chargeWallet,
    [queryKeys.chargeWallet],
    [queryKeys.userProfile, queryKeys.userPayment, queryKeys.chargeWallet]
  );
  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useGetUserPayment = (page, limit) => {
  const { data, isPending, isSuccess, refetch, isError } = useGetData({
    url: endPoints.userPayment,
    params: { page, limit },
    queryKeys: [queryKeys.userPayment],
    enabled: true,
  });

  return { data, isPending, isSuccess, refetch, isError };
};

export const useGetAllPayments = (page, limit) => {
  const { data, isPending, isSuccess, refetch, isError } = useGetData({
    url: endPoints.adminPayments,
    params: { page, limit },
    queryKeys: [queryKeys.adminPayments],
    enabled: true,
  });

  return { data, isPending, isSuccess, refetch, isError };
};

export const usePayment = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.payment,
    [queryKeys.payment],
    [queryKeys.userProfile, queryKeys.userPayment, queryKeys.chargeWallet]
  );
  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useCancelPayment = (url) => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    url,
    [queryKeys.cancelSession],
    [queryKeys.userProfile, queryKeys.userPayment, queryKeys.chargeWallet]
  );
  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useCompletePayment = (url) => {
  const { data, isPending, isSuccess, refetch } = useGetData(
    url,
    [queryKeys.completeSession],
    [queryKeys.userProfile, queryKeys.userPayment, queryKeys.chargeWallet]
  );
  return { data, isPending, isSuccess, refetch };
};
