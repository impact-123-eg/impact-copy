import endPoints from "@/config/endPoints";
import queryKeys from "@/config/queryKeys";
import useDeleteData from "@/hooks/curdsHook/useDeleteData";
import useGetData from "@/hooks/curdsHook/useGetData";
import usePatchData from "@/hooks/curdsHook/usePatchData";
import usePostData from "@/hooks/curdsHook/usePostData";

export const useGetUserProfile = () => {
  const { data, isPending, isSuccess, refetch } = useGetData({
    url: endPoints.userProfile,
    queryKeys: [queryKeys.userProfile],
    enabled: true,
  });

  return { data, isPending, isSuccess, refetch };
};

export const useGetEmployeeById = (id) => {
  const { data, isPending, isSuccess, refetch } = useGetData({
    url: `${endPoints.users}${id}`,
    queryKeys: [queryKeys.users, id],
    enabled: true,
  });

  return { data, isPending, isSuccess, refetch };
};

export const useGetAllEmployees = () => {
  const { data, isPending, isSuccess, refetch } = useGetData({
    url: endPoints.allEmployees,
    queryKeys: [queryKeys.allEmployees],
    enabled: true,
  });

  return { data, isPending, isSuccess, refetch };
};

export const useGetAllStudents = () => {
  const { data, isPending, isSuccess, refetch } = useGetData({
    url: endPoints.allStudents,
    queryKeys: [queryKeys.allStudents],
    enabled: true,
  });

  return { data, isPending, isSuccess, refetch };
};

export const useUpdateUser = () => {
  const { mutate, isPending, isSuccess } = usePatchData(
    endPoints.users,
    [queryKeys.updateUser],
    [queryKeys.userProfile, queryKeys.allEmployees, queryKeys.users]
  );

  return { mutate, isPending, isSuccess };
};

export const useCreateUser = () => {
  const { mutate, isPending, isSuccess } = usePostData(
    endPoints.users,
    [queryKeys.createUser],
    [queryKeys.userProfile, queryKeys.allEmployees, queryKeys.users]
  );
  return { mutate, isPending, isSuccess };
};

export const useDeleteUser = () => {
  const { mutate, isPending, isSuccess } = useDeleteData(
    endPoints.users,
    [queryKeys.deleteUser],
    [queryKeys.userProfile, queryKeys.allEmployees, queryKeys.users]
  );
  return { mutate, isPending, isSuccess };
};

export const useGetUsers = (filters = {}) => {
  const queryString = new URLSearchParams(filters).toString();
  const { data, isPending, isSuccess, refetch } = useGetData({
    url: `${endPoints.users}?${queryString}`,
    queryKeys: [queryKeys.users, filters],
    enabled: true,
  });

  return { data, isPending, isSuccess, refetch };
};
