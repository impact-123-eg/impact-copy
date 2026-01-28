import endPoints from "@/config/endPoints";
import queryKeys from "@/config/queryKeys";
import useGetData from "@/hooks/curdsHook/useGetData";
import usePostData from "@/hooks/curdsHook/usePostData";

export const useGetAffiliateStats = () => {
    const { data, isPending, isSuccess, refetch } = useGetData({
        url: endPoints.affiliateStats,
        queryKeys: [queryKeys.affiliateStats],
        enabled: true,
    });

    return { data, isPending, isSuccess, refetch };
};

import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

export const useValidatePromoCode = () => {
    const { token } = useAuth();

    return useMutation({
        mutationFn: async (code) => {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}${endPoints.affiliateValidate}?code=${code}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        }
    });
};

export const useGetAffiliateConfig = () => {
    const { data, isPending, isSuccess, refetch } = useGetData({
        url: endPoints.affiliateConfig,
        queryKeys: [queryKeys.affiliateConfig],
        enabled: true,
    });

    return { data, isPending, isSuccess, refetch };
};

export const useUpdateAffiliateConfig = () => {
    const { mutate, isPending, isSuccess } = usePostData(
        endPoints.affiliateConfig,
        ["updateAffiliateConfig"],
        [queryKeys.affiliateConfig]
    );
    return { mutate, isPending, isSuccess };
};
export const useGetReferralHistory = () => {
    const { data, isPending, isSuccess, refetch } = useGetData({
        url: endPoints.affiliateReferrals,
        queryKeys: ["affiliateReferrals"],
        enabled: true,
    });
    return { data, isPending, isSuccess, refetch };
};

export const useAdminGetReferralHistory = (userId) => {
    const { data, isPending, isSuccess, refetch } = useGetData({
        url: `${endPoints.affiliateReferrals}/${userId}`,
        queryKeys: ["affiliateReferrals", userId],
        enabled: !!userId,
    });
    return { data, isPending, isSuccess, refetch };
};

export const useAdminGetAllReferrals = (limit = 20) => {
    const { data, isPending, isSuccess, refetch } = useGetData({
        url: `${endPoints.affiliateReferrals}/all?limit=${limit}`,
        queryKeys: ["affiliateReferralsAll", limit],
        enabled: true,
    });
    return { data, isPending, isSuccess, refetch };
};
