"use client";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DemoEmailSignIn = ({ isSignIn, setIsSignIn }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState([]);
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      name: name,
      email: email,
      password: password,
    });
    // console.log("Form error", formError);
    if (result?.error) {
      const formError = JSON.parse(result.error);
      setFormError(formError.errors?.errors);
    } else {
      toast.success("User Registered Successfully");
      router.push("/dashboard");
    }
  };
  return (
    <div className="w-full mt-[20px]">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-start 2xl:gap-[10px] gap-[7px]"
      >
        {!isSignIn && (
          <div className="w-full">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full px-[10px] xl:py-[10px] py-[7px] border-[0.5px] border-[#DFDFE4] bg-white rounded-[4px] focus-visible:outline-none  placeholder:text-[12px] placeholder:text-[#A1A1A1] lg:placeholder:tracking-[-0.72px] placeholder:tracking-normal"
            />
            {formError?.name && (
              <div className="mt-2 ">
                {formError?.name?.map((nError, index) => (
                  <p
                    className="font-medium text-red-500 text-[14px]"
                    key={index}
                  >
                    {nError}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
        <div className="w-full">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email"
            className="w-full px-[10px] xl:py-[10px] py-[7px] border-[0.5px] border-[#DFDFE4] bg-white rounded-[4px] focus-visible:outline-none  placeholder:text-[12px] placeholder:text-[#A1A1A1] lg:placeholder:tracking-[-0.72px] placeholder:tracking-normal"
          />
          {formError?.email && (
            <div className="mt-2 ">
              {formError?.email?.map((eError, index) => (
                <p className="font-medium text-red-500 text-[14px]" key={index}>
                  {eError}
                </p>
              ))}
            </div>
          )}
        </div>
        <div className="w-full">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type your password "
            className="w-full px-[10px] xl:py-[10px] py-[7px] border-[0.5px] border-[#DFDFE4] bg-white rounded-[4px] focus-visible:outline-none  placeholder:text-[12px] placeholder:text-[#A1A1A1] lg:placeholder:tracking-[-0.72px] placeholder:tracking-normal"
          />
          {formError?.password && (
            <div className="mt-2 ">
              {formError?.password?.map((pError, index) => (
                <p className="font-medium text-red-500 text-[14px]" key={index}>
                  {pError}
                </p>
              ))}
            </div>
          )}
        </div>

        {isSignIn && (
          <button className="text-[#555] text-[12px] leading-normal tracking-normal xl:tracking-[-0.36px]">
            Forget Password?
          </button>
        )}

        <button
          type="submit"
          className="w-full xl:text-[16px] text-[14px] bg-[#070707] text-[#F1F4F2] tracking-normal xl:tracking-[-0.96px] mt-[10px] px-[10px] py-[7px] xl:py-[10px] rounded-[4px] transition"
        >
          {isSignIn ? "Sign In" : "Sign Up"}
        </button>
      </form>

      <div className="xl:text-[16px] text-[#555] text-[14px] font-medium leading-4 tracking-normal xl:tracking-[-0.48px] mt-[16px]">
        <span>If you don’t have an account </span>
        <button
          type="button"
          onClick={() => {
            setIsSignIn(!isSignIn);
          }}
          className="text-[#074BDE] font-medium hover:underline transition"
        >
          {isSignIn ? "Signup" : "SignIn "}
        </button>
        <span> here?</span>
      </div>
    </div>
  );
};

export default DemoEmailSignIn;
