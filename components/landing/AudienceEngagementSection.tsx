import Image from "next/image";
import React from "react";
import { engagementFeatures } from "../../utils/LandingPageContents";

export default function AudienceEngagementSection() {
  return (
    <section className="py-10 sm:py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="relative mb-8 lg:mb-0">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-2xl"></div>
            <div className="relative p-2 sm:p-8 rounded-2xl">
              <Image
                src="/images/Rectangle8.png"
                alt="Audience Engagement"
                width={600}
                height={400}
                className="w-full h-auto object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 max-w-xl">
              Keep Your Audience <br className="hidden md:block" /> Active, Not
              Just <br className="hidden md:block" /> Present
            </h2>
            <div className="space-y-4 sm:space-y-6">
              {engagementFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 items-center justify-center">
                    <Image
                      src={feature.icon}
                      alt={feature.alt}
                      width={32}
                      height={32}
                      className="w-10 h-10 object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#282828]">
                      {feature.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
