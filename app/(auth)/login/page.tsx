"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  const { email, password, } = form;

  setIsLoading(true);
  try {
    const response = await fetch("https://api.blocstage.com/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const token = data.token;
      localStorage.setItem("authToken", token);
      
      router.push("/viewevent"); 
    } else {
      // Handle errors from the API
      const errorData = await response.json();
      console.error("Login error:", errorData);
      // Display error message to the user
      alert(`Login error: ${errorData.message}`);
    }
  } catch (error) {
    // Handle network errors
    console.error("Login error:", error);
    alert("An error occurred during Login. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

  const [isScrolled, setIsScrolled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex min-h-screen">
    <div className="absolute px-10 md:px-24 mt-6">
                <a href="/landingpage" className="cursor-pointer">
                  <Image className="justify-center items-center"
                  src="/images/logoorange.png"
                  alt="blocStage"
                  width={120}
                  height={32}
                  />
                </a>
            </div>
      {/* Left: Form Section */}
      <div className="flex-1 flex flex-col justify-center px-10 md:px-24 bg-white">
       

        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">
            Get Started
          </h1>
          <p className="text-gray-600">
            Login and get started with Blocstage!
          </p>
        </div>

        {/* Form */}
<form onSubmit={handleLogin} className="space-y-6">
  
    <>
    
      <div>
        <label className="block text-sm font-semibold text-gray-400 mb-1">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          placeholder="Johndoe@gmail.com"
          value={form.email}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        />
      </div>

      {/* Password */}
      <div className="relative">
        <label className="block text-sm font-semibold text-gray-400 mb-1">
          Password
        </label>
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Enter password"
          value={form.password}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        />
        <span
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-[42px] cursor-pointer text-gray-500"
        >
          {showPassword ? (
            <EyeOff size={20} />
          ) : (
            <Eye size={20} />
          )}
        </span>
      </div>

      
      {/* Button */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3 bg-[#0C2D48] text-white rounded-md font-semibold hover:bg-[#0a263c] transition flex items-center justify-center ${
          isLoading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Signing in...
          </>
        ) : (
          'Continue'
        )}
      </button>
    </>
  
    
  
</form>

        {/* Sign In Link */}
        <p className="text-center mt-6 text-gray-600 text-sm">
          Don't have an account?{" "}
          <a href="/signup" className="text-[#f4511e] font-semibold">
            Sign up
          </a>
        </p>
        {/* Sign In Link */}
        <p className="text-center mt-6 text-gray-600 text-sm">
          Can't remember your password?{" "}
          <a href="/forget-password" className="text-[#f4511e] font-semibold">
            Forgot Password
          </a>
        </p>
      </div>

      {/* Right: Image Section */}
      <div className="hidden lg:block flex-1 relative">
        <Image
          src="/images/signupimage.png"
          alt="Signup Background"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
    </div>
  );
}

export default LoginPage;
