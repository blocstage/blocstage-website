"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

const SignupPage = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    country: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
  e.preventDefault();
  const { firstName, lastName, userName, email, password, confirmPassword } = form;

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  setIsLoading(true);
  try {
    const response = await fetch("https://api.blocstage.com/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: userName, 
        email,
        password,
        first_name: firstName, 
        last_name: lastName,   
      }),
    });

    if (response.ok) {
      // Handle successful registration
      sessionStorage.setItem("registeredUserName", userName);
      sessionStorage.setItem("registeredEmail", email);
      router.push("/verify-account"); // Redirect to OTP page
    } else {
      // Handle errors from the API
      const errorData = await response.json();
      console.error("Registration error:", errorData);
      // Display error message to the user
      alert(`Registration failed: ${errorData.message}`);
    }
  } catch (error) {
    // Handle network errors
    console.error("Signup error:", error);
    alert("An error occurred during registration. Please try again.");
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
          <h1 className="text-3xl font-bold mb-2 mt-4">
            {step === 1 ? "Create Account" : "Tell us About Yourself"}
          </h1>
          <p className="text-gray-600">
            It’s free to create an account and get started with Blocstage!
          </p>
        </div>

        {/* Form */}
<form onSubmit={step === 1 ? handleNext : handleSignup} className="space-y-6">
  {step === 1 ? (
    <>
    <div>
        <label className="block text-sm font-semibold text-gray-400 mb-1">
          Username
        </label>
        <input
          type="text"
          name="userName"
          placeholder="Johndoe"
          value={form.userName}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        />
      </div>
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

      {/* Confirm Password */}
      <div className="relative">
        <label className="block text-sm font-semibold text-gray-400 mb-1">
          Confirm Password
        </label>
        <input
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Repeat password"
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        />
        <span
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-[42px] cursor-pointer text-gray-500"
        >
          {showConfirmPassword ? (
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
            Processing...
          </>
        ) : (
          'Continue'
        )}
      </button>
    </>
  ) : (
    <>
      <div>
        <label className="block text-sm font-semibold text-gray-400 mb-1">
          First Name
        </label>
        <input
          type="text"
          name="firstName"
          placeholder="John"
          value={form.firstName}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-400 mb-1">
          Last Name
        </label>
        <input
          type="text"
          name="lastName"
          placeholder="Doe"
          value={form.lastName}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-400 mb-1">
          Country
        </label>
        <select
          name="country"
          value={form.country}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        >
          <option value="">Select your country</option>
          <option value="Nigeria">Nigeria</option>
          <option value="Ghana">Ghana</option>
          <option value="Togo">Togo</option>
          <option value="Senegal">Senegal</option>
          <option value="Mali">Mali</option>
          <option value="Guinea">Guinea</option>
          <option value="Burkina Faso">Burkina Faso</option>
          <option value="Niger">Niger</option>
          <option value="Liberia">Liberia</option>
          <option value="Cote d&#39;Ivoire">Cote d&#39;Ivoire</option>
          <option value="Benin">Benin</option>
          <option value="Tanzania">Tanzania</option>
          <option value="Kenya">Kenya</option>
          <option value="South Africa">South Africa</option>
          <option value="Uganda">Uganda</option>
          <option value="Rwanda">Rwanda</option>
          <option value="Zambia">Zambia</option>
          <option value="Zimbabwe">Zimbabwe</option>
          <option value="Cameroon">Cameroon</option>
          <option value="Congo">Congo</option>
          <option value="Gabon">Gabon</option>
          <option value="Angola">Angola</option>
          <option value="Mozambique">Mozambique</option>
          <option value="Namibia">Namibia</option>
          <option value="Botswana">Botswana</option>
          <option value="Malawi">Malawi</option>
          <option value="Sierra Leone">Sierra Leone</option>
          <option value="Togo">Togo</option>
          <option value="Mauritius">Mauritius</option>
          <option value="Madagascar">Madagascar</option>
          <option value="USA">USA</option>
          <option value="Canada">Canada</option>
          <option value="UK">UK</option>
        </select>
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
            Creating Account...
          </>
        ) : (
          'Create Account'
        )}
      </button>
    </>
  )}
</form>

        {/* Sign In Link */}
        <p className="text-center mt-6 text-gray-600 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-[#f4511e] font-semibold">
            Sign In
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

export default SignupPage;
