"use client";

import Footer from "../components/Footer";
import AllInOnePlatformSection from "../components/landing/AllInOnePlatformSection";
import AudienceEngagementSection from "../components/landing/AudienceEngagementSection";
import CommunityBuildingSection from "../components/landing/CommunityBuildingSection";
import EventManagementSection from "../components/landing/EventManagementSection";
import HeroSection from "../components/landing/HeroSection";
import Navigation from "../components/landing/Navigation";
import RecognitionRewardsSection from "../components/landing/RecognitionRewardsSection";
import Web3ReadySection from "../components/landing/Web3ReadySection";

export default function Home() {
  return (
       <div className="min-h-screen bg-white">
         <Navigation />
         <HeroSection />
         <EventManagementSection />
         <AudienceEngagementSection />
         <RecognitionRewardsSection />
         <CommunityBuildingSection />
         <Web3ReadySection />
         <AllInOnePlatformSection />
         <Footer />
       </div>
  );
}