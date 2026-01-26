import endPoints from "@/config/endPoints";
import queryKeys from "@/config/queryKeys";
import useDeleteData from "@/hooks/curdsHook/useDeleteData";
import useGetData from "@/hooks/curdsHook/useGetData";
import usePatchData from "@/hooks/curdsHook/usePatchData";
import usePostData from "@/hooks/curdsHook/usePostData";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";
import postRequest from "@/hooks/handleRequest/PostRequest";

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
    url: `${endPoints.users}/${id}`,
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

export const useCreateUserFromBooking = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["createUserFromBooking"],
    mutationFn: async ({ id }) => {
      const url = `${endPoints.users}/create-from-booking/${id}`;
      return postRequest(url, {}, token);
    },
    onSuccess: (data) => {
      const successMessage = data?.data?.message || "User profile created successfully";
      toast.success(successMessage);
      queryClient.invalidateQueries({ queryKey: [queryKeys.users] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.allStudents] });
      queryClient.invalidateQueries({ queryKey: ["FreeSessionBooking"] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.allEmployees] });
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Failed to create profile";
      toast.error(errorMessage);
    }
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess
  };
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

// Student Profile Hooks
export const useUpdateMe = () => {
  const { mutate, isPending, isSuccess } = usePatchData(
    endPoints.updateMe,
    [queryKeys.updateMe],
    [queryKeys.userProfile]
  );
  return { mutate, isPending, isSuccess };
};

export const useGetStudentHistory = () => {
  const { data, isPending, isSuccess, refetch } = useGetData({
    url: endPoints.history,
    queryKeys: [queryKeys.history],
    enabled: true,
  });
  return { data, isPending, isSuccess, refetch };
};

// Admin User Management Hooks
export const useAdminGetUsers = (filters = {}) => {
  const queryString = new URLSearchParams(filters).toString();
  const { data, isPending, isSuccess, refetch } = useGetData({
    url: `${endPoints.adminAllUsers}?${queryString}`,
    queryKeys: [queryKeys.adminAllUsers, filters],
    enabled: true,
  });
  return { data, isPending, isSuccess, refetch };
};

export const useAddUserNote = () => {
  const { mutate, isPending, isSuccess } = usePostData(
    endPoints.addUserNote,
    [queryKeys.addUserNote],
    [queryKeys.adminAllUsers]
  );
  return { mutate, isPending, isSuccess };
};

export const useToggleSubscription = () => {
  const { mutate, isPending, isSuccess } = usePostData(
    endPoints.toggleSubscription,
    [queryKeys.toggleSubscription],
    [queryKeys.adminAllUsers]
  );
  return { mutate, isPending, isSuccess };
};
