import endPoints from "@/config/endPoints";
import queryKeys from "@/config/queryKeys";
import usePostData from "@/hooks/curdsHook/usePostData";

const useRegister = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.register,
    [queryKeys.register]
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export default useRegister;
