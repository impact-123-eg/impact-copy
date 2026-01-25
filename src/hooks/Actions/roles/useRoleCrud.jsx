import endPoints from "@/config/endPoints";
import queryKeys from "@/config/queryKeys";
import useGetData from "@/hooks/curdsHook/useGetData";

// Hook to get all roles
export const useGetAllRoles = () => {
  const { data, isPending, isSuccess, refetch } = useGetData({
    url: endPoints.roles || `${endPoints.base}roles`, // Using a fallback if roles endpoint doesn't exist
    queryKeys: [queryKeys.roles],
    enabled: true,
  });

  return { data, isPending, isSuccess, refetch };
};