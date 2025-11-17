import endPoints from "@/config/endPoints";
import queryKeys from "@/config/queryKeys";
import useGetData from "@/hooks/curdsHook/useGetData";

export const useGetAllFreeTests = () => {
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
