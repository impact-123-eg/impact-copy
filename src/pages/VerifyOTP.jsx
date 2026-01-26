import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { useI18n } from "../hooks/useI18n";
import useVerifyOTP from "../hooks/Actions/auth/useVerifyOTP";
import useResendOTP from "../hooks/Actions/auth/useResendOTP";
import { otpValidationSchema } from "../Validation";
import ErrorMsg from "../Components/auth/ErrorMsg";
import { FaShieldAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const VerifyOTP = () => {
    const { t } = useTranslation();
    const { localizePath, t: tValid } = useI18n();
    const navigate = useNavigate();
    const location = useLocation();
    const { setToken, setUser, setIsLoggedIn } = useAuth();
    const { mutate: verifyMutate, isPending: isVerifying } = useVerifyOTP();
    const { mutate: resendMutate, isPending: isResending } = useResendOTP();

    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            navigate(localizePath("/register"));
        }
    }, [email, navigate, localizePath]);

    const formik = useFormik({
        initialValues: { otp: "" },
        validationSchema: otpValidationSchema(tValid),
        onSubmit: (values) => {
            verifyMutate(
                { data: { email, otp: values.otp } },
                {
                    onSuccess: (data) => {
                        Swal.fire({
                            icon: "success",
                            title: "Verified!",
                            text: "Your account is now active",
                            timer: 2000,
                            showConfirmButton: false,
                        });
                        // Auto login after verification
                        if (data.data?.token) {
                            setToken(data.data.token);
                            setUser(data.data.user);
                            setIsLoggedIn(true);
                            navigate(localizePath("/profile")); // Redirect to profile
                        } else {
                            navigate(localizePath("/login"));
                        }
                    },
                    onError: (error) => {
                        Swal.fire({
                            icon: "error",
                            title: "Invalid Code",
                            text: error.message || "Please check the code and try again",
                        });
                    },
                }
            );
        },
    });

    const handleResend = () => {
        resendMutate(
            { data: { email } },
            {
                onSuccess: () => {
                    Swal.fire({
                        icon: "success",
                        title: "OTP Sent",
                        text: "A new code has been sent to your email",
                        timer: 2000,
                        showConfirmButton: false,
                    });
                },
            }
        );
    };

    return (
        <div className="max-w-md mx-auto bg-white/70 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/20">
            <div className="text-center mb-8">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                    <FaShieldAlt size={32} />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Verification</h2>
                <p className="text-gray-600 mt-2">
                    We've sent a 6-digit code to <br />
                    <span className="font-bold text-gray-800">{email}</span>
                </p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
                <div className="space-y-2 text-center">
                    <input
                        name="otp"
                        type="text"
                        maxLength="6"
                        placeholder="000000"
                        className="w-full text-center text-3xl tracking-[0.5em] py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-mono"
                        {...formik.getFieldProps("otp")}
                    />
                    <ErrorMsg formik={formik} type="otp" />
                </div>

                <button
                    type="submit"
                    disabled={isVerifying || !formik.isValid}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transform transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                    {isVerifying ? (
                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <span>Verify & Continue</span>
                    )}
                </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-gray-600">Didn't receive the code?</p>
                <button
                    onClick={handleResend}
                    disabled={isResending}
                    className="text-blue-600 font-bold hover:underline mt-2 disabled:opacity-50"
                >
                    {isResending ? "Sending..." : "Resend Code"}
                </button>
            </div>
        </div>
    );
};

export default VerifyOTP;
