import React from 'react'
import { Button } from "@/components/ui/button";
import { SiFacebook } from "@icons-pack/react-simple-icons";
import { CheckCircle, Mail } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col md:flex-row items-center bg-black px-4 sm:px-8 md:px-12 py-12 pt-32 md:pt-12">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/stellarhero.jpg')" }}
      >
        <div className="absolute inset-0 bg-black opacity-60" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto text-left w-full px-2 sm:px-4 lg:px-8">
        <div className="max-w-4xl">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight text-white mb-6">
            Host <span className="text-[#E04E1E]">Events</span> You Can
            Remember. Build <br />{" "}
            <span className="text-[#E04E1E]">Communities</span> That Last.
          </h1>
          <p className="text-xl sm:text-base md:text-xl text-white mb-8 font-normal max-w-2xl">
            An all-in-one platform that helps you plan, run, and grow meaningful
            events and community.
          </p>

          <div className="mb-8 sm:mb-10">
            <a href="/signup">
              <Button className="bg-[#E04E1E] hover:bg-orange-600 text-white px-6 py-3 text-sm font-medium rounded-md">
                Get Started
              </Button>
            </a>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-2 sm:gap-x-8 sm:gap-y-4 text-white text-xl sm:text-xl font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#E04E1E]" />
              <span>Ticketing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#E04E1E]" />
              <span>Feedbacks</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#E04E1E]" />
              <span>Audience Engagement</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#E04E1E]" />
              <span>Rewards & Bounties</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection