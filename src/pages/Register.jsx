import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { useI18n } from "../hooks/useI18n";
import useRegister from "../hooks/Actions/auth/useRegister";
import ErrorMsg from "../Components/auth/ErrorMsg";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaGlobe } from "react-icons/fa";

const Register = () => {
    const { t } = useTranslation();
    const { localizePath } = useI18n();
    const navigate = useNavigate();
    const { mutate, isPending } = useRegister();

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            phoneNumber: "",
            preferredLanguage: "english",
        },
        validationSchema: Yup.object({
            name: Yup.string().required(t("validation", "nameRequired", "Name is required")),
            email: Yup.string().email(t("validation", "invalidEmail", "Invalid email")).required(t("validation", "emailRequired", "Email is required")),
            password: Yup.string().min(6, t("validation", "min6", "Password must be at least 6 characters")).required(t("validation", "passwordRequired", "Password is required")),
            phoneNumber: Yup.string().required(t("validation", "phoneRequired", "Phone number is required")),
        }),
        onSubmit: (values) => {
            mutate(
                { data: values },
                {
                    onSuccess: (data) => {
                        Swal.fire({
                            icon: "success",
                            title: "Success",
                            text: data.data.message || "Please check your email for OTP",
                            timer: 2000,
                            showConfirmButton: false,
                        });
                        navigate(localizePath("/verify-otp"), { state: { email: values.email } });
                    },
                    onError: (error) => {
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: error.message || "Registration failed",
                        });
                    },
                }
            );
        },
    });

    return (
        <div className="max-w-md mx-auto bg-white/70 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/20">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
                <p className="text-gray-600 mt-2">Join Impact English Courses</p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-5">
                {/* Name */}
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Name</label>
                    <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            name="name"
                            type="text"
                            placeholder="John Doe"
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            {...formik.getFieldProps("name")}
                        />
                    </div>
                    <ErrorMsg formik={formik} type="name" />
                </div>

                {/* Email */}
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Email</label>
                    <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            name="email"
                            type="email"
                            placeholder="john@example.com"
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            {...formik.getFieldProps("email")}
                        />
                    </div>
                    <ErrorMsg formik={formik} type="email" />
                </div>

                {/* Phone */}
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Phone Number</label>
                    <div className="relative">
                        <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            name="phoneNumber"
                            type="text"
                            placeholder="+1234567890"
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            {...formik.getFieldProps("phoneNumber")}
                        />
                    </div>
                    <ErrorMsg formik={formik} type="phoneNumber" />
                </div>

                {/* Password */}
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
                    <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            {...formik.getFieldProps("password")}
                        />
                    </div>
                    <ErrorMsg formik={formik} type="password" />
                </div>

                {/* Language */}
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Preferred Language</label>
                    <div className="relative">
                        <FaGlobe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select
                            name="preferredLanguage"
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none appearance-none"
                            {...formik.getFieldProps("preferredLanguage")}
                        >
                            <option value="english">English</option>
                            <option value="arabic">Arabic</option>
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transform transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                    {isPending ? (
                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <span>Register Now</span>
                    )}
                </button>
            </form>

            <div className="mt-8 text-center text-gray-600">
                Already have an account?{" "}
                <Link to={localizePath("/login")} className="text-blue-600 font-bold hover:underline">
                    Login
                </Link>
            </div>
        </div>
    );
};

export default Register;
