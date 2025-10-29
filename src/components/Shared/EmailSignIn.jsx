"use client";

import ForgetPasswordDialog from "@/app/signin/_components/ForgetPassDialog";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import "react-toastify/dist/ReactToastify.css";

const NAME_REGEX = /^[A-Za-z]{4,}$/;

const EmailSignIn = ({ isSignIn, setIsSignIn }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  const handleInputChange = useCallback(
    (field) => (e) => {
      const value = e.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
      if (formError[field]) {
        setFormError((prev) => ({
          ...prev,
          [field]: null,
        }));
      }
    },
    [formError]
  );

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const clearForm = useCallback(() => {
    setFormData({ name: "", email: "", password: "" });
    setFormError({});
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (loading) return;

      setLoading(true);
      setFormError({});

      if (!isSignIn) {
        const cleanedName = formData.name.trim(); // we still trim ends
        if (!NAME_REGEX.test(cleanedName)) {
          setFormError((prev) => ({
            ...prev,
            name: [
              "Name must be at least 4 letters with no spaces or special characters.",
            ],
          }));
          setLoading(false);
          return;
        }
      }

      if (formData.password.trim().length < 8) {
        setFormError((prev) => ({
          ...prev,
          password: ["Password should be at least 8 characters long."],
        }));
        setLoading(false);
        return;
      }

      try {
        const result = await signIn("credentials", {
          redirect: false,
          name: formData.name.trim().replace(/\s+/g, " "),
          email: formData.email.trim(),
          password: formData.password,
        });

        if (!result?.ok) {
          let message = "Sign in failed.";
          if (result?.error) {
            try {
              const parsed = JSON.parse(result.error);
              message = parsed?.errors?.errors?.email?.[0] || message;
            } catch {}
          }
          setFormError({ general: [message] });
          setLoading(false);
          return;
        }

        const newSession = await getSession();
        if (newSession?.user?.followingsCount >= 5) {
          window.location.href = "/dashboard";
        } else {
          router.push("/dashboard/add-company-list");
        }
      } catch (error) {
        console.error("Sign in error:", error);
        setFormError({
          general: ["An unexpected error occurred. Please try again."],
        });
        setLoading(false);
      }
    },
    [formData, isSignIn, loading, router]
  );

  const toggleMode = useCallback(() => {
    setIsSignIn((prev) => !prev);
    clearForm();
  }, [setIsSignIn, clearForm]);

  const eyeIcon = useMemo(
    () => ({
      hide: "/assets/images/eyeHide.svg",
      show: "/assets/images/eyeShow.svg",
    }),
    []
  );

  const renderErrors = useCallback((errors) => {
    if (!errors) return null;
    return (
      <div className="mt-2">
        {errors.map((error, index) => (
          <p key={index} className="font-medium text-red-500 text-[14px]">
            {error}
          </p>
        ))}
      </div>
    );
  }, []);

  return (
    <div className="w-full mt-[20px]">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col items-start 2xl:gap-[10px] gap-[7px]"
      >
        {!isSignIn && (
          <div className="w-full">
            <input
              type="text"
              value={formData.name}
              onChange={handleInputChange("name")}
              placeholder="Your Name"
              className="w-full px-[10px] xl:py-[10px] py-[7px] border-[0.5px] border-[#DFDFE4] bg-white rounded-[4px] focus-visible:outline-none placeholder:text-[12px] placeholder:text-[#A1A1A1]"
              disabled={loading}
            />
            {renderErrors(formError.name)}
          </div>
        )}
        <div className="w-full">
          <input
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleInputChange("email")}
            placeholder="Your Email"
            className="w-full px-[10px] xl:py-[10px] py-[7px] border-[0.5px] border-[#DFDFE4] bg-white rounded-[4px] focus-visible:outline-none placeholder:text-[12px] placeholder:text-[#A1A1A1]"
            disabled={loading}
          />
          {renderErrors(formError.email)}
        </div>
        <div className="w-full relative">
          <input
            type={showPassword ? "text" : "password"}
            value={formData.password}
            autoComplete="new-password"
            onChange={handleInputChange("password")}
            placeholder="Type your password"
            className="w-full px-[10px] xl:py-[10px] py-[7px] border-[0.5px] border-[#DFDFE4] bg-white rounded-[4px] focus-visible:outline-none placeholder:text-[12px] placeholder:text-[#A1A1A1]"
            disabled={loading}
          />

          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer focus:outline-none"
            onClick={togglePasswordVisibility}
            disabled={loading}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <img
              src={showPassword ? eyeIcon.show : eyeIcon.hide}
              alt={showPassword ? "Hide password" : "Show password"}
              className="w-full h-full"
            />
          </button>

          {renderErrors(formError.password)}
        </div>

        {isSignIn && (
          <button
            type="button"
            className="text-[#555] text-[12px] hover:underline focus:outline-none"
            onClick={() => setIsOpen(true)}
          >
            Forget Password?
          </button>
        )}

        {renderErrors(formError.general)}

        <button
          type="submit"
          disabled={loading}
          className={`w-full xl:text-[16px] text-[14px] mt-[10px] px-[10px] py-[7px] xl:py-[10px] rounded-[4px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#074BDE] focus:ring-opacity-50
            ${
              loading
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-[#070707] text-[#F1F4F2] hover:bg-[#2a2a2a] cursor-pointer"
            }`}
        >
          {loading
            ? isSignIn
              ? "Signing In..."
              : "Signing Up..."
            : isSignIn
            ? "Sign In"
            : "Sign Up"}
        </button>
      </form>
      <ForgetPasswordDialog isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="xl:text-[16px] text-[#555] text-[14px] font-medium mt-[16px]">
        <span>If you don't have an account </span>
        <button
          type="button"
          onClick={toggleMode}
          className="text-[#074BDE] font-medium hover:underline transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#074BDE] focus:ring-opacity-50 rounded"
          disabled={loading}
        >
          {isSignIn ? "Signup" : "SignIn "}
        </button>
        <span> here?</span>
      </div>
    </div>
  );
};

export default EmailSignIn;
