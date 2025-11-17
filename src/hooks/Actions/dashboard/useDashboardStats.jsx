import endPoints from "@/config/endPoints";
import queryKeys from "@/config/queryKeys";
import useGetData from "@/hooks/curdsHook/useGetData";

const useDashboardStats = () => {
  const { data, isPending, isSuccess, error, refetch, ...rest } = useGetData({
    url: endPoints.dashboard,
    queryKeys: [queryKeys.dashboard],
  });

  return { data, isPending, isSuccess, error, refetch, ...rest };
};

export default useDashboardStats;
