import endPoints from "@/config/endPoints";
import queryKeys from "@/config/queryKeys";
import usePostData from "@/hooks/curdsHook/usePostData";

const useResetPassword = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.resetPassword,
    [queryKeys.resetPassword],
    []
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export default useResetPassword;
