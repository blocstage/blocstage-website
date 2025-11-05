"use client";

import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const VerifySuccessPage = () => {
  const [isClient, setIsClient] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<'success' | 'error' | 'loading'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!isClient) return;

      const token = searchParams.get('token');
      
      if (!token) {
        setVerificationStatus('error');
        setErrorMessage('No verification token provided');
        setIsVerifying(false);
        return;
      }

      try {
        const response = await fetch(`https://api.blocstage.com/auth/verify-email?token=${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setVerificationStatus('success');
        } else {
          const errorData = await response.json();
          setVerificationStatus('error');
          setErrorMessage(errorData.message || 'Email verification failed');
        }
      } catch (error) {
        setVerificationStatus('error');
        setErrorMessage('Network error. Please try again.');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [isClient, searchParams]);

  if (!isClient) {
    return null;
  }

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
          {verificationStatus === 'loading' && <Loader2 className="w-20 h-20 text-blue-500 animate-spin" />}
          {verificationStatus === 'success' && <CheckCircle2 className="w-20 h-20 text-green-500" />}
          {verificationStatus === 'error' && <XCircle className="w-20 h-20 text-red-500" />}
        </div>
        
        {verificationStatus === 'loading' && (
          <>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Verifying Email...
            </h1>
            <p className="text-gray-600 mb-8">
              Please wait while we verify your email address.
            </p>
          </>
        )}

        {verificationStatus === 'success' && (
          <>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Email Verified Successfully!
            </h1>
            <p className="text-gray-600 mb-8">
              Your email has been successfully verified. You can now proceed to log in to your account.
            </p>
            <Link href="/login">
              <button className="w-full py-3 px-6 bg-[#092C4C] text-white font-semibold rounded-md shadow-md hover:bg-[#072036] transition-colors duration-300">
                Go to Login
              </button>
            </Link>
          </>
        )}

        {verificationStatus === 'error' && (
          <>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Verification Failed
            </h1>
            <p className="text-gray-600 mb-8">
              {errorMessage || 'There was an error verifying your email. Please try again.'}
            </p>
            <div className="flex gap-4">
              <Link href="/signup">
                <button className="flex-1 py-3 px-6 bg-gray-500 text-white font-semibold rounded-md shadow-md hover:bg-gray-600 transition-colors duration-300">
                  Try Again
                </button>
              </Link>
              <Link href="/login">
                <button className="flex-1 py-3 px-6 bg-[#092C4C] text-white font-semibold rounded-md shadow-md hover:bg-[#072036] transition-colors duration-300">
                  Go to Login
                </button>
              </Link>
            </div>
          </>
        )}
      </div>

      <footer className="mt-8 text-sm text-gray-500">
        © 2025 Blocstage. All rights reserved.
      </footer>
    </div>
  );
};

export default VerifySuccessPage;