import { useAuth } from "@/context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import patchRequest from "../handleRequest/PatchRequest";

const usePatchData = (url, mutationKeys, invalidateQueryKey) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: mutationKeys,
    mutationFn: async ({ data, url: overrideUrl, id }) => {
      const finalUrl = id ? `${url}${id}` : overrideUrl;

      console.log(finalUrl);
      return patchRequest(finalUrl, data, token);
    },
    onMutate: () => {
      const loadingToast = toast.loading("جاري التحميل...");
      return { loadingToast };
    },
    onSuccess: (data, variables, context) => {
      const successMessage = data?.data?.message || "تم التحديث بنجاح";

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
      const errorMessage =
        error.response?.data?.message || "حدث خطأ ما، يرجى المحاولة مرة أخرى";

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

export default usePatchData;
