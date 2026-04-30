import React from "react";

const PriceSection = () => {
  return (
    <div className="relative flex flex-col items-center mt-5 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center">
        Simple pricing for small businesses
      </h1>
      <p className="py-2 text-[#E9B13B] text-sm sm:text-base text-center">
        Pay less than what you lose from one missed order
      </p>

      {/* Background watermark - hidden on mobile for better readability */}
      <p className="hidden md:block text-gray-600/30 -z-50 text-[8rem] sm:text-[10rem] md:text-[12rem] lg:text-[15rem] font-bold absolute select-none">
        Pricing
      </p>

      {/* Cards container - responsive flex layout */}
      <div className="flex flex-col items-center justify-center sm:flex-row gap-5 mt-8 sm:mt-12 md:mt-20 w-full max-w-7xl mx-auto">
        {/* Free Plan Card */}
        <div className="backdrop-blur-sm hover:border-[#E9B13B] rounded-xl border border-gray-700 w-full md:w-80 p-4 sm:p-6 hover:shadow-2xl hover:shadow-yellow-500/40 transition-all duration-300 hover:-translate-y-1 bg-black/40">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-100">
              Free
            </h2>
            <div className="mt-4">
              <span className="text-4xl sm:text-5xl font-bold text-white">
                $0
              </span>
              <span className="text-gray-400 text-sm sm:text-base">/month</span>
            </div>
          </div>

          <div className="border-t border-gray-800 my-4 sm:my-6"></div>

          <div className="space-y-3">
            <div className="flex gap-3 items-center">
              <div className="w-5 h-5 rounded-full bg-yellow-500/20 border border-yellow-500 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-3 h-3 text-yellow-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="text-xs sm:text-sm text-gray-300">
                Limited orders
              </span>
            </div>

            <div className="flex gap-3 items-center">
              <div className="w-5 h-5 rounded-full bg-yellow-500/20 border border-yellow-500 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-3 h-3 text-yellow-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="text-xs sm:text-sm text-gray-300">
                Basic dashboard
              </span>
            </div>

            <div className="flex gap-3 items-center">
              <div className="w-5 h-5 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-3 h-3 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <span className="text-xs sm:text-sm text-gray-500">
                No driver system
              </span>
            </div>
          </div>

          <button className="w-full mt-6 sm:mt-8 py-2 px-4 hover:border-black/40 rounded-lg border border-gray-700 bg-gray-900/50 text-gray-300 font-semibold hover:bg-gradient-to-bl from-[#E9B13B] to-[#654808] hover:text-black transition-all duration-300 text-sm sm:text-base">
            Get Started
          </button>
        </div>

        {/* Basic Plan Card */}
        <div className="backdrop-blur-sm hover:border-[#E9B13B]  rounded-xl border border-gray-700 w-full md:w-80 p-4 sm:p-6 hover:shadow-2xl hover:shadow-yellow-500/10 transition-all duration-300 hover:-translate-y-1 bg-black/40">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-100">
              Basic Plan
            </h2>
            <div className="mt-4">
              <span className="text-4xl sm:text-5xl font-bold text-white">
                $3
              </span>
              <span className="text-gray-400 text-sm sm:text-base">/month</span>
            </div>
          </div>

          <div className="border-t border-gray-800 my-4 sm:my-6"></div>

          <div className="space-y-3">
            <div className="flex gap-3 items-center">
              <div className="w-5 h-5 rounded-full bg-yellow-500/20 border border-yellow-500 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-3 h-3 text-yellow-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="text-xs sm:text-sm text-gray-300">
                Driver management
              </span>
            </div>

            <div className="flex gap-3 items-center">
              <div className="w-5 h-5 rounded-full bg-yellow-500/20 border border-yellow-500 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-3 h-3 text-yellow-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="text-xs sm:text-sm text-gray-300">
                Unlimited Orders
              </span>
            </div>

            <div className="flex gap-3 items-center">
              <div className="w-5 h-5 rounded-full bg-yellow-500/20 border border-yellow-500 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-3 h-3 text-yellow-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="text-xs sm:text-sm text-gray-300">
                Public order link
              </span>
            </div>

            <div className="flex gap-3 items-center">
              <div className="w-5 h-5 rounded-full bg-yellow-500/20 border border-yellow-500 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-3 h-3 text-yellow-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="text-xs sm:text-sm text-gray-300">
                Status tracking
              </span>
            </div>
          </div>

          <button className="w-full mt-6 sm:mt-8 py-2 px-4 rounded-lg border border-gray-700 bg-gray-900/50 text-gray-300 font-semibold hover:bg-gradient-to-bl from-[#E9B13B] to-[#654808] hover:text-black hover:border-black/40 transition-all duration-300 text-sm sm:text-base">
            Start Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PriceSection;
