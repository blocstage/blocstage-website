"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import axios from "axios";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleResetPassword = async (e:any) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Simulate an API call
    try {
      
      await axios.post("https://api.blocstage.com/auth/request-password-reset", { email });

      // Simulate a success response
      setTimeout(() => {
        setMessage(
          "If an account with that email exists, we've sent a password reset link to your inbox."
        );
        setLoading(false);
      }, 2000);
    } catch (error) {
      // Simulate an error response
      setMessage("Failed to send reset link. Please try again.");
      setLoading(false);
    }
  };

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

      <div className="bg-white p-8 md:p-12 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Forgot Password?
        </h1>
        <p className="text-gray-600 mb-8">
          Enter your email to receive a password reset link.
        </p>

        <form onSubmit={handleResetPassword} className="space-y-6">
          <div className="relative">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#092C4C]"
              required
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Mail size={20} />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 px-6 bg-[#092C4C] text-white font-semibold rounded-md shadow-md hover:bg-[#072036] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {message && (
          <p className="mt-6 text-sm text-gray-600">{message}</p>
        )}

        <div className="mt-8 text-sm text-gray-600">
          Remember your password?{" "}
          <Link href="/login" className="text-[#f4511e] font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;