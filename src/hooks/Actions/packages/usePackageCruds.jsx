import endPoints from "@/config/endPoints";
import queryKeys from "@/config/queryKeys";
import { useAuth } from "@/context/AuthContext";
import useDeleteData from "@/hooks/curdsHook/useDeleteData";
import useGetData from "@/hooks/curdsHook/useGetData";
import usePatchData from "@/hooks/curdsHook/usePatchData";
import usePostData from "@/hooks/curdsHook/usePostData";

export const useGetAllpackages = () => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.packages,
    queryKeys: [queryKeys.packages],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};

export const useGetpackageById = ({ id, enabled }) => {
  const { data, isPending, isSuccess, refetch } = useGetData({
    url: `${endPoints.packages}${id}`,
    queryKeys: [queryKeys.packages, id],
    enabled: enabled,
  });

  return { data, isPending, isSuccess, refetch };
};

export const useAddpackage = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.packages,
    [queryKeys.packages],
    [queryKeys.packages]
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useUpdatepackage = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePatchData(
    endPoints.packages,
    [queryKeys.packages],
    [queryKeys.packages]
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useDeletepackage = () => {
  const { mutate, isPending, isSuccess } = useDeleteData(
    endPoints.packages,
    [queryKeys.packages],
    [queryKeys.packages]
  );
  return { mutate, isPending, isSuccess };
};
