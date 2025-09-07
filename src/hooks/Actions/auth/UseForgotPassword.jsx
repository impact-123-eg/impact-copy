import endPoints from "@/config/endPoints";
import queryKeys from "@/config/queryKeys";
import usePostData from "@/hooks/curdsHook/usePostData";

const useForgotPassword = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.forgotPassword,
    [queryKeys.forgotPassword],
    []
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export default useForgotPassword;
