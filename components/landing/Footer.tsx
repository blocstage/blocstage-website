import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-[#092C4C]  text-white py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          <div>
            <div className="flex gap-4 sm:gap-10 items-center space-x-3 mb-2">
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
            <p className="text-gray-200 mt-5 text-md sm:text-md">
              More than events, it&apos;s an ecosystem.
            </p>
          </div>
          <div className="flex flex-col space-y-4 sm:space-y-6 md:space-y-0 md:items-start">
            <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">
              Follow Us
            </h4>
            <div className="flex flex-wrap items-center space-x-4 sm:space-x-6 md:space-x-6">
              {/* <a
                href="#"
                className="flex items-center space-x-2 text-gray-300 hover:text-white"
              >
                <span>Telegram</span>
              </a> */}
              <a
                href="https://www.instagram.com/blocstage/"
                className="flex items-center space-x-2 text-gray-300 hover:text-white"
              >
                <Image
                  src="/images/Vector copy.png"
                  alt="Facebook"
                  width={24}
                  height={24}
                  className="w-5 h-5"
                />
                <span>Instagram</span>
              </a>
              <a
                href="https://x.com/bloc_stage"
                className="flex items-center space-x-2 text-gray-300 hover:text-white"
              >
                <Image
                  src="/images/Vector copy 2.png"
                  alt="Facebook"
                  width={24}
                  height={24}
                  className="w-5 h-5"
                />
                <span>Twitter</span>
              </a>
              
            </div>
          </div>
        </div>
        <hr className="border-gray-600 my-6 sm:my-8" />
        <div className="flex flex-col md:flex-row items-center justify-between text-gray-300 text-xs sm:text-sm space-y-2 sm:space-y-4 md:space-y-0">
          <div>© 2025 BlocStage. All rights reserved.</div>
          <div className="flex space-x-4 sm:space-x-6">
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="hover:underline">
              Terms of Service
            </a>
            <a href="#" className="hover:underline">
              Cookies Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
