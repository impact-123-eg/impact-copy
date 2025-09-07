import { useAuth } from "@/context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import deleteRequest from "../handleRequest/DeleteRequest";

const useDeleteData = (url, mutationKeys, invalidateQueryKey) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: mutationKeys,
    mutationFn: async ({ url: overrideUrl, id }) => {
      const finalUrl = id ? `${url}${id}` : overrideUrl;
      return deleteRequest(finalUrl, token);
    },
    onMutate: () => {
      const loadingToast = toast.loading("Processing...");
      return { loadingToast };
    },
    onSuccess: (data, variables, context) => {
      const successMessage = data?.data?.message || "Deleted Successfully!";

      const invalidateKeys = Array.isArray(invalidateQueryKey)
        ? invalidateQueryKey
        : [invalidateQueryKey];

      invalidateKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });

      if (context?.loadingToast) {
        toast.success(successMessage, {
          id: context.loadingToast,
        });
      }
    },
    onError: (error, variables, context) => {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong";

      if (context?.loadingToast) {
        toast.error(errorMessage, {
          id: context.loadingToast,
          duration: 5000,
        });
      }
    },
  });

  return { ...mutation };
};

export default useDeleteData;
