"use client";
import axios from "axios";
import { useEffect, useState } from "react";

const ForgetPasswordDialog = ({ isOpen, setIsOpen }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setMessage("");
      setError("");
      setLoading(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/forgot-password`,
        { email }
      );
      setMessage(data?.data?.message || "Reset link sent!");
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.response?.data?.errors?.email?.[0] ||
        "Something went wrong. Please try again.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setEmail("");
    setMessage("");
    setError("");
    setLoading(false);
  };

  return (
    <>
      {isOpen && (
        <div className="modal modal-open backdrop-blur-md bg-black/70">
          <div className="modal-box bg-white">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">Reset Password</h3>
              <button
                onClick={handleClose}
                className="btn btn-sm btn-circle btn-ghost"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <p className="py-4">
              Enter your email and we’ll send you a reset link.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="input input-bordered w-full bg-white text-black"
                />
                <div className="mt-2 min-h-[20px]">
                  {message && (
                    <p className="text-sm text-green-600">{message}</p>
                  )}
                  {error && <p className="text-sm text-red-600">{error}</p>}
                </div>
              </div>

              <div className="modal-action">
                <button
                  type="submit"
                  className="btn btn-primary bg-black hover:bg-gray-800 border-none"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ForgetPasswordDialog;
