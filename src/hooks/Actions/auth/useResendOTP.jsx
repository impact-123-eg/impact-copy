import endPoints from "@/config/endPoints";
import queryKeys from "@/config/queryKeys";
import usePostData from "@/hooks/curdsHook/usePostData";

const useResendOTP = () => {
    const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
        endPoints.resendOTP,
        [queryKeys.resendOTP]
    );

    return { mutate, data, error, isPending, isSuccess, isError };
};

export default useResendOTP;
