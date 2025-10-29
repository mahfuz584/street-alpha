"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SocialCallback() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const handleSocialCallback = async () => {
      try {
        const code = new URLSearchParams(window.location.search).get("code");
        if (!code) {
          setError("❌ Invalid code");
          setLoading(false);
          return;
        }

        const response = await axios.post(
          "https://streetalpha.codixel.tech/api/auth/exchange",
          { code }
        );

        const { token, token_expires_at, user, followings_count } =
          response.data;

        if (!token || !user) {
          setError("❌ Missing token or user data.");
          setLoading(false);
          return;
        }

        // Sign in with credentials provider using social data
        const result = await signIn("credentials", {
          redirect: false,
          email: user.email,
          id: user.id.toString(), // Ensure it's a string
          name: user.name,
          accessToken: token,
          tokenExpiresAt: token_expires_at,
          followingsCount: (followings_count || 0).toString(), // Ensure it's a string
        });

        if (result?.ok) {
          const session = await fetch("/api/auth/session").then((res) =>
            res.json()
          );

          if (session?.user?.email) {
            if (session?.user?.followingsCount >= 5) {
              localStorage.setItem(`tabUnlocked_${session.user.email}`, "true");
              window.location.href = "/dashboard";
            } else {
              window.location.href = "/dashboard/add-company-list";
            }
          }
          return;
        } else {
          console.error("❌ NextAuth sign-in failed:", result);
          setError(
            `❌ Failed to complete social sign-in: ${
              result?.error || "Unknown error"
            }`
          );
        }
      } catch (err) {
        console.error("❌ Error during social callback:", err);
        if (err.response) {
          console.error("❌ Response data:", err.response.data);
          setError(
            `❌ Server error: ${err.response.data?.message || err.message}`
          );
        } else {
          setError("❌ Network error during social sign-in.");
        }
      } finally {
        setLoading(false);
      }
    };

    handleSocialCallback();
  }, [router]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-700 text-lg mb-4">{error}</p>
          <button
            onClick={() => router.push("/signin")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-600">Signing...</p>
      </div>
    </div>
  );
}
