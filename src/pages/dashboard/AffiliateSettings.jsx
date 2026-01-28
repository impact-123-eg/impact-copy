import { useState, useEffect } from "react";
import { useGetAffiliateConfig, useUpdateAffiliateConfig, useAdminGetAllReferrals } from "@/hooks/Actions/affiliate/useAffiliate";
import { useI18n } from "@/hooks/useI18n";
import { FaPercentage, FaMoneyBillWave, FaSave, FaCheckCircle, FaHistory, FaUsers, FaChartLine } from "react-icons/fa";
import Swal from "sweetalert2";

const AffiliateSettings = () => {
    const { t } = useI18n();
    const { data: configData, isLoading: isLoadingConfig, refetch } = useGetAffiliateConfig();
    const { mutate: updateConfig, isPending: isUpdating } = useUpdateAffiliateConfig();
    const { data: referralsData, isLoading: isLoadingReferrals } = useAdminGetAllReferrals(30);

    const referrals = referralsData?.data || [];
    const totalDistributedRewards = referrals.reduce((sum, r) => sum + (r.rewardAmount || 0), 0);

    const [formData, setFormData] = useState({
        discountPercentage: 10,
        ownerRewardAmount: 50,
        isActive: true,
    });

    useEffect(() => {
        if (configData?.data) {
            setFormData({
                discountPercentage: configData.data.discountPercentage,
                ownerRewardAmount: configData.data.ownerRewardAmount,
                isActive: configData.data.isActive,
            });
        }
    }, [configData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        updateConfig({ data: formData }, {
            onSuccess: () => {
                Swal.fire({
                    icon: "success",
                    title: t("general", "success", "Success"),
                    text: t("affiliate", "configUpdated", "Settings updated successfully"),
                    timer: 2000,
                    showConfirmButton: false,
                });
                refetch();
            },
            onError: (err) => {
                Swal.fire({
                    icon: "error",
                    title: t("general", "error", "Error"),
                    text: err.response?.data?.message || "Failed to update settings",
                });
            }
        });
    };

    if (isLoadingConfig) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <FaPercentage /> {t("affiliate", "adminTitle", "Affiliate Program Settings")}
                    </h1>
                    <p className="opacity-90 mt-2">{t("affiliate", "adminDesc", "Configure the rewards and discounts for your student affiliate program.")}</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8 border-b border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <FaPercentage className="text-blue-600" /> {t("affiliate", "discountPercentage", "Student Discount (%)")}
                            </label>
                            <p className="text-xs text-gray-400">{t("affiliate", "discountHelp", "The percentage discount given to the user who uses the promo code.")}</p>
                            <div className="relative">
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    className="w-full pl-4 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-xl"
                                    value={formData.discountPercentage}
                                    onChange={(e) => setFormData({ ...formData, discountPercentage: Number(e.target.value) })}
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-xl">%</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <FaMoneyBillWave className="text-emerald-600" /> {t("affiliate", "rewardAmount", "Owner Reward (EGP)")}
                            </label>
                            <p className="text-xs text-gray-400">{t("affiliate", "rewardHelp", "The fixed amount credited to the promo code owner after a successful booking.")}</p>
                            <div className="relative">
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full pl-4 pr-16 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-xl"
                                    value={formData.ownerRewardAmount}
                                    onChange={(e) => setFormData({ ...formData, ownerRewardAmount: Number(e.target.value) })}
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">EGP</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                    <FaCheckCircle className="text-blue-600" /> {t("affiliate", "programStatus", "Active Status")}
                                </h3>
                                <p className="text-sm text-gray-500">{t("affiliate", "statusDesc", "Enable or disable the entire affiliate system.")}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                />
                                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={isUpdating}
                            className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center gap-3 hover:bg-black transition-all shadow-xl shadow-gray-200 hover:scale-105 active:scale-95 disabled:opacity-50"
                        >
                            <FaSave /> {isUpdating ? t("general", "saving", "Saving...") : t("general", "saveChanges", "Save Settings")}
                        </button>
                    </div>
                </form>

                <div className="p-8 bg-gray-50/50">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                        <FaChartLine className="text-blue-600" /> Platform Overview
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                                <FaUsers size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{t("affiliate", "totalReferrals", "Total Successful Referrals")}</p>
                                <h3 className="text-2xl font-black text-gray-900">{referrals.length}</h3>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
                                <FaChartLine size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{t("affiliate", "totalRewardsDistributed", "Total Rewards Distributed")}</p>
                                <h3 className="text-2xl font-black text-gray-900">{totalDistributedRewards} EGP</h3>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
                        <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800 flex items-center gap-3">
                                <FaHistory className="text-blue-600" /> {t("affiliate", "recentReferrals", "Recent Platform Referrals")}
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            {isLoadingReferrals ? (
                                <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
                            ) : referrals.length > 0 ? (
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">{t("affiliate", "owner", "Promo Owner")}</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">{t("affiliate", "student", "Used By")}</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">{t("affiliate", "date", "Date")}</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">{t("affiliate", "reward", "Reward")}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {referrals.map((ref, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-gray-900">{ref.promoCodeOwner?.name}</div>
                                                    <div className="text-xs text-gray-500">{ref.promoCodeOwner?.email}</div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-800 font-medium">{ref.name}</td>
                                                <td className="px-6 py-4 text-xs text-gray-500">{new Date(ref.createdAt).toLocaleDateString()}</td>
                                                <td className="px-6 py-4">
                                                    <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-bold text-xs">
                                                        +{ref.rewardAmount} EGP
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-12 text-center text-gray-500 italic">
                                    {t("affiliate", "noPlatformReferrals", "No referrals recorded on the platform yet.")}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AffiliateSettings;
