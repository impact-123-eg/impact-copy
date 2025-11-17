import endPoints from "@/config/endPoints";
import queryKeys from "@/config/queryKeys";
import useGetData from "@/hooks/curdsHook/useGetData";
import usePostData from "@/hooks/curdsHook/usePostData";

export const useSubmitTest = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.submitTest,
    [queryKeys.submitTest],
    []
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useStartTest = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.startTest,
    [queryKeys.startTest],
    []
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useGetTest = () => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.getTest,
    queryKeys: [queryKeys.getTest],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};
