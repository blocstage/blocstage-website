import React from 'react'
import { platformFeatures } from '../../utils/LandingPageContents'
import Image from 'next/image'

export default function AllInOnePlatformSection() {
  return (
       <section className="py-10 sm:py-16 md:py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
              <div className="mb-8 sm:mb-12 max-w-md text-left">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                  Ditch the Tool Stack
                  <br className="hidden md:block" />— BlocStage Has It All
                </h2>
              </div>
    
              <div className="mx-2 max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-y-4 sm:gap-y-6 gap-x-8 sm:gap-x-8">
                {platformFeatures.map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <Image
                      src="/images/Icon.png"
                      alt=""
                      width={34}
                      height={34}
                      className="w-6 h-6 object-cover"
                    />
                    <span className="font-semibold text-gray-900">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
  )
}
