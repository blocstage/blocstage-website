import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { features } from "../../utils/LandingPageContents";
import Image from "next/image";

export default function EventManagementSection() {
  return (
    <section className="py-10 sm:py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8">
        <div className="text-left mb-12">
          <p className="mb-4 text-[#E04E1E]">Event Management</p>
          <h2 className="text-3xl md:text-4xl max-w-2xl font-bold text-[#282828] mb-4">
            Everything You Need to Host Exceptional Events
          </h2>
        </div>
        <div className="relative">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none w-40 h-40 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-[#FFE5D0] via-[#FFD1B3] to-[#FFB380] opacity-20 blur-2xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8 relative z-10">
            {features.slice(0, 2).map((feature, index) => (
              <div key={index}>
                <Card
                  className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md"
                  style={{ padding: "20px" }}
                >
                  <CardHeader>
                    <div className="mb-4 ">
                      <Image
                        src={feature.icon}
                        alt={feature.title}
                        width={32}
                        height={32}
                        className="w-8 h-8 object-cover rounded-lg"
                      />
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-900 max-w-3xl mb-4">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
            {features.slice(2, 4).map((feature, index) => (
              <div key={index + 2}>
                <Card
                  className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md"
                  style={{ padding: "20px" }}
                >
                  <CardHeader>
                    <div className="mb-4 ">{feature.icon}</div>
                    <CardTitle className="text-xl font-semibold text-gray-900 mb-4">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
