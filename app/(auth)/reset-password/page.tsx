"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
      validateToken(tokenParam);
    } else {
      setError("Invalid or missing reset token");
      setValidating(false);
    }
  }, [searchParams]);

  const validateToken = async (token: string) => {
    try {
      const response = await fetch(`https://api.blocstage.com/auth/reset-password?token=${token}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setMessage("Token is valid. Please enter your new password.");
        setValidating(false);
      } else {
        setError("Invalid or expired reset token. Please request a new password reset.");
        setValidating(false);
      }
    } catch (error) {
      setError("Failed to validate token. Please try again.");
      setValidating(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://api.blocstage.com/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          new_password: password,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setMessage("Password has been successfully reset!");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to reset password. Please try again.");
      }
    } catch (error) {
      setError("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-8 md:p-12 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#092C4C] mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Validating Token</h2>
          <p className="text-gray-600">Please wait while we validate your reset token...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-8 md:p-12 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Password Reset Successful!
          </h1>
          <p className="text-gray-600 mb-8">
            Your password has been successfully reset. You will be redirected to the login page shortly.
          </p>
          <Link
            href="/login"
            className="inline-block py-3 px-6 bg-[#092C4C] text-white font-semibold rounded-md shadow-md hover:bg-[#072036] transition-colors duration-300"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      {/* Logo Section */}
      <div className="absolute top-6 left-6">
        <a href="/landingpage" className="cursor-pointer">
          <Image
            src="/images/logoorange.png"
            alt="Company Logo"
            width={150}
            height={40}
          />
        </a>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 text-center">
          Reset Password
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Enter your new password below.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {message && !error && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-green-700 text-sm">{message}</p>
          </div>
        )}

        <form onSubmit={handleResetPassword} className="space-y-6">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#092C4C]"
              required
              minLength={8}
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Lock size={20} />
            </div>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#092C4C]"
              required
              minLength={8}
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Lock size={20} />
            </div>
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-6 bg-[#092C4C] text-white font-semibold rounded-md shadow-md hover:bg-[#072036] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !password || !confirmPassword}
          >
            {loading ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>

        <div className="mt-8 text-sm text-gray-600 text-center">
          Remember your password?{" "}
          <Link href="/login" className="text-[#f4511e] font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
