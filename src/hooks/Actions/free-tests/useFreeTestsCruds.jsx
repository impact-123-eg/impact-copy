import endPoints from "@/config/endPoints";
import queryKeys from "@/config/queryKeys";
import useGetData from "@/hooks/curdsHook/useGetData";
import usePatchData from "@/hooks/curdsHook/usePatchData";

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

export const useUpdateLevelForFreeTest = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePatchData(
    endPoints.getTest,
    [queryKeys.getTest, "updateTestLevel"],
    [queryKeys.getTest, queryKeys.getTestById]
  );

  const updateLevel = ({ id, level }) =>
    mutate({
      data: { level },
      url: `${endPoints.getTest}${id}/level`,
    });

  return { mutate: updateLevel, data, error, isPending, isSuccess, isError };
};
