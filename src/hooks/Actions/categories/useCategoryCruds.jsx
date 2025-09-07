import endPoints from "@/config/endPoints";
import queryKeys from "@/config/queryKeys";
import { useAuth } from "@/context/AuthContext";
import useDeleteData from "@/hooks/curdsHook/useDeleteData";
import useGetData from "@/hooks/curdsHook/useGetData";
import usePatchData from "@/hooks/curdsHook/usePatchData";
import usePostData from "@/hooks/curdsHook/usePostData";

export const useGetAllcategories = () => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.categories,
    queryKeys: [queryKeys.categories],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};

export const useGetcategoryById = ({ id, enabled }) => {
  const { data, isPending, isSuccess, refetch } = useGetData({
    url: `${endPoints.categories}${id}`,
    queryKeys: [queryKeys.categories, id],
    enabled: enabled,
  });

  return { data, isPending, isSuccess, refetch };
};

export const useAddCategory = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.categories,
    [queryKeys.addCategory],
    [queryKeys.categories]
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useUpdateCategory = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePatchData(
    endPoints.categories,
    [queryKeys.categories],
    [queryKeys.categories]
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useDeleteCategory = () => {
  const { mutate, isPending, isSuccess } = useDeleteData(
    endPoints.categories,
    [queryKeys.categories],
    [queryKeys.categories]
  );
  return { mutate, isPending, isSuccess };
};
