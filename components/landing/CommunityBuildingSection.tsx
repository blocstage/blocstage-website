import Image from 'next/image'
import React from 'react'

export default function CommunityBuildingSection() {
  return (
    <section className="py-10 sm:py-16 md:py-24 bg-white">
           <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8">
             <div className="text-left mb-12">
               <p className="mb-4 text-[#E04E1E]">Who Is It For?</p>
               <h2 className="text-3xl md:text-4xl max-w-xl font-bold text-[#282828]">
                 Built for Anyone <br className="hidden md:block" /> Building a
                 Community
               </h2>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6 text-center">
               <div className="flex flex-col items-center">
                 <Image
                   src="/images/1.png"
                   alt="Creators & Event Organizers"
                   width={200}
                   height={160}
                   className="w-full max-w-xl h-32 sm:h-40 object-cover rounded-lg shadow-md mb-4"
                 />
                 <h3 className="text-lg font-semibold text-gray-900 mb-2">
                   Creators & Event <br className="hidden md:block" />
                   Organizers
                 </h3>
               </div>
               <div className="flex flex-col items-center">
                 <Image
                   src="/images/2.png"
                   alt="Creators & Event Organizers"
                   width={200}
                   height={160}
                   className="w-full max-w-xl h-32 sm:h-40 object-cover rounded-lg shadow-md mb-4"
                 />
                 <h3 className="text-lg font-semibold text-gray-900 mb-2">
                   Companies & <br className="hidden md:block" /> Founders
                 </h3>
               </div>
               <div className="flex flex-col items-center">
                 <Image
                   src="/images/3.png"
                   alt="Creators & Event Organizers"
                   width={200}
                   height={160}
                   className="w-full max-w-xl h-32 sm:h-40 object-cover rounded-lg shadow-md mb-4"
                 />
                 <h3 className="text-lg text-center font-semibold text-gray-900 mb-2">
                   Ecosystem Builders & Community Managers
                 </h3>
               </div>
               <div className="flex flex-col items-center">
                 <Image
                   src="/images/4.png"
                   alt="Creators & Event Organizers"
                   width={200}
                   height={160}
                   className="w-full max-w-xl h-32 sm:h-40 object-cover rounded-lg shadow-md mb-4"
                 />
                 <h3 className="text-lg font-semibold text-gray-900 mb-2">
                   Marketers{" "}
                 </h3>
               </div>
             </div>
           </div>
         </section>
  )
}
