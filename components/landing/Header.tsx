"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "../ui/button";

export default function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed lg:hidden top-0 w-full z-50 transition-all duration-300 p-4  ${
        isScrolled
          ? "bg-slate-900/95 backdrop-blur-sm shadow-lg"
          : "bg-slate-900/95 backdrop-blur-sm shadow-lg"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between ">
          <div className="flex items-center">
            <a href="/landingpage" className="cursor-pointer">
              <Image
                src="/images/blocsagelogo.png"
                alt="BlocStage logo"
                width={96}
                height={96}
                className="object-contain"
                priority
              />
            </a>
          </div>
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="signup">
              <Button className="bg-[#E04E1E] hover:bg-orange-600 text-white hover:cursor-pointer px-4 py-3 text-sm font-medium rounded-md">
                Get Started
              </Button>
            </a>
          </div>
          {/* Mobile Nav Toggle */}
          <button
            className="md:hidden flex items-center px-3 py-2 border rounded text-white border-white"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Toggle navigation"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={
                  mobileNavOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>
        {/* Mobile Nav Menu */}
        {mobileNavOpen && (
          <div className="md:hidden flex flex-col space-y-2 mt-2 pb-4">
            <a href="login">
              <Button className="w-full outline-none text-white hover:cursor-pointer px-6 py-3 text-sm font-medium rounded-md">
                Login
              </Button>
            </a>
            <a href="signup">
              <Button className="w-full bg-[#E04E1E] hover:bg-orange-600 text-white hover:cursor-pointer px-6 py-3 text-sm font-medium rounded-md">
                Get Started
              </Button>
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
