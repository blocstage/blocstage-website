"use client";

import { MailIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const VerifyAccount = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }
const openMailApp = () => {
  window.location.href = "mailto:";
};
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="absolute top-6 left-6">
       <a href="/landingpage" className="cursor-pointer">
         <Image className="justify-center items-center"
                         src="/images/logoorange.png"
                         alt="blocStage"
                         width={150}
                         height={40}
                         />
       </a>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
            <MailIcon className="w-20 h-20 text-[#092C4C]" />
          {/* <CheckCircle2 className="w-20 h-20 text-green-500" /> */}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Verify Your Email!
        </h1>
        <p className="text-gray-600 mb-8">
          An email has been sent to you. Please check your inbox and click on
          the link to proceed to log in to your account.
        </p>
          <button onClick={openMailApp} className="w-full py-3 px-6 bg-[#092C4C] text-white font-semibold rounded-md shadow-md hover:bg-[#072036] transition-colors duration-300">
            Open Mail Box
          </button>
      </div>

      <footer className="mt-8 text-sm text-gray-500">
        © 2025 Blocstage. All rights reserved.
      </footer>
    </div>
  );
};

export default VerifyAccount;