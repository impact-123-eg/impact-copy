import endPoints from "@/config/endPoints";
import queryKeys from "@/config/queryKeys";
import usePostData from "@/hooks/curdsHook/usePostData";

const useVerifyOTP = () => {
    const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
        endPoints.verifyOTP,
        [queryKeys.verifyOTP]
    );

    return { mutate, data, error, isPending, isSuccess, isError };
};

export default useVerifyOTP;
