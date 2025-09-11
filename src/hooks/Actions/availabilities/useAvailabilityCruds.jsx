import endPoints from "@/config/endPoints";
import queryKeys from "@/config/queryKeys";
import { useAuth } from "@/context/AuthContext";
import useDeleteData from "@/hooks/curdsHook/useDeleteData";
import useGetData from "@/hooks/curdsHook/useGetData";
import usePatchData from "@/hooks/curdsHook/usePatchData";
import usePostData from "@/hooks/curdsHook/usePostData";

export const useGetAllAvailabilities = () => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.availabilities,
    queryKeys: [queryKeys.availabilities],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};

export const useGetAvailabilityById = ({ id, enabled }) => {
  const { data, isPending, isSuccess, refetch } = useGetData({
    url: `${endPoints.availabilities}${id}`,
    queryKeys: [queryKeys.availabilities, id],
    enabled: enabled,
  });

  return { data, isPending, isSuccess, refetch };
};

export const useAddAvailability = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.availabilities,
    [queryKeys.addAvailability],
    [queryKeys.availabilities]
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useUpdateAvailability = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePatchData(
    endPoints.availabilities,
    [queryKeys.updateAvailability],
    [queryKeys.availabilities]
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useDeleteAvailability = () => {
  const { mutate, isPending, isSuccess } = useDeleteData(
    endPoints.availabilities,
    [queryKeys.deleteAvailability],
    [queryKeys.availabilities]
  );
  return { mutate, isPending, isSuccess };
};
