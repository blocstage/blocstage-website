import Image from 'next/image';
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RecognitionRewardsSection() {
  return (
    <section
      className="py-10 sm:py-16 md:py-24 relative"
      style={{
        backgroundImage:
          "linear-gradient(to bottom right, rgba(15,15,15,0.85), rgba(30,30,30,0.80)), url('/images/jetpad.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-7xl sm:px-4 lg:px-8 mx-auto px-2">
        <div className="text-left ">
          <h2 className="text-3xl md:text-4xl font-bold text-white px-4 max-w-2xl mb-12">
            Recognize contributions.
            <br className="hidden md:block" /> Reward engagement.{" "}
            <br className="hidden md:block" /> Track impact.
          </h2>
          <p className="text-xl text-gray-300 max-w-xl px-4 mb-4">
            BlocStage Earn isn’t just for events—it powers ongoing interaction
            within communities. Organizers and managers can post tasks,
            bounties, and challenges for members, whether public, exclusive, or
            tied to special events.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2 md:grid-row-1 text-xl">
          {[
            {
              icon: (
                <Image
                  src="/images/blockk.png"
                  alt="Post Tasks & Bounties"
                  width={12}
                  height={12}
                  className="w-6 h-6 object-cover rounded-lg"
                />
              ),
              title:
                "Post tasks, bounties, or events for your community of event attendees",
            },
            {
              icon: (
                <Image
                  src="/images/blockk.png"
                  alt="Post Tasks & Bounties"
                  width={12}
                  height={12}
                  className="w-6 h-6 object-cover rounded-lg"
                />
              ),
              title:
                "Acknowledge participants with badges, NFTs, certificates, or awards",
            },
            {
              icon: (
                <Image
                  src="/images/blockk.png"
                  alt="Post Tasks & Bounties"
                  width={12}
                  height={12}
                  className="w-6 h-6 object-cover rounded-lg"
                />
              ),
              title:
                "Set prize pools for top NFT holder holders for events for each event",
            },
            {
              icon: (
                <Image
                  src="/images/blockk.png"
                  alt="Post Tasks & Bounties"
                  width={40}
                  height={40}
                  className="w-6 h-6 object-cover "
                />
              ),
              title:
                "Use leaderboards and live boost participation and long-term engagement",
            },
          ].map((item, index) => (
            <Card key={index} className="text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <span>{item.icon}</span>
                  <p className="text-sm leading-relaxed">{item.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
