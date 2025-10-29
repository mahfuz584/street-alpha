"use client";

import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const ResetPassword = ({ token }) => {
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!token || loading) return;

    setError("");
    setSuccess("");

    const fd = new FormData(e.currentTarget);
    const email = (fd.get("email") || "").trim();
    const password = fd.get("password") || "";
    const confirm = fd.get("confirm") || "";

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/reset-password`,
        { token, email, password, password_confirmation: confirm }
      );
      setSuccess(res?.data?.data?.message || "Password reset successfully.");
      e.target.reset();
    } catch (err) {
      const msg =
        err?.response?.data?.errors?.email?.[0] ||
        err?.response?.data?.errors?.token?.[0] ||
        "Reset failed.";

      console.log(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center bg-[url('/assets/images/pexels-pixabay-529621.jpg')] bg-cover bg-center h-screen px-4">
      <form
        noValidate
        onSubmit={onSubmit}
        className={`2xl:px-[45px] 2xl:py-[35px] xl:px-[40px] xl:py-[25px] py-[18px] px-[25px] flex flex-col gap-5 w-full max-w-[506px] mx-auto rounded-[24px] bg-white shadow-[0px_24px_39px_0px_rgba(50,50,50,0.25)] h-auto ${
          success && "h-[344px]"
        }`}
      >
        <h1
          className={`text-xl font-semibold text-[#111] ${
            success && "text-center mt-auto"
          }`}
        >
          Reset Password
        </h1>

        {!success && (
          <>
            <input
              name="email"
              type="email"
              placeholder="Your email"
              autoComplete="email"
              className="w-full px-3 py-2 border border-[#DFDFE4] rounded focus:ring-2 focus:ring-[#074BDE] bg-white text-black"
              disabled={loading || success}
              required
            />

            <div className="relative w-full">
              <input
                name="password"
                type={showPass ? "text" : "password"}
                placeholder="New password"
                autoComplete="new-password"
                className="w-full px-3 py-2 border border-[#DFDFE4] rounded focus:ring-2 focus:ring-[#074BDE] text-black bg-white"
                disabled={loading || success}
                required
              />
              <button
                type="button"
                onClick={() => setShowPass((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-gray-600"
              >
                {showPass ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>

            <div className="relative w-full">
              <input
                name="confirm"
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm password"
                className="w-full px-3 py-2 border border-[#DFDFE4] rounded focus:ring-2 focus:ring-[#074BDE] bg-white text-black"
                disabled={loading || success}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-gray-600"
              >
                {showConfirm ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>
          </>
        )}

        {error && <div className="text-sm text-red-600">{error}</div>}
        {success && (
          <div className="text-lg text-green-600  text-center -mb-2">
            {success}
          </div>
        )}

        {success ? (
          <button className="btn btn-primary bg-black hover:bg-gray-800 border-none mx-auto px-4 w-28 mb-[5rem]">
            <Link href="/signin">Sign In</Link>
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
            }`}
          >
            {loading ? "Submitting..." : "Reset Password"}
          </button>
        )}
      </form>
    </div>
  );
};

export default ResetPassword;
