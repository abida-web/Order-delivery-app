import { auth } from "@/lib/auth";
import { ArrowRight, Play } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import React from "react";

const Hero = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  return (
    <div className="relative overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="flex sm:flex-row gap-4 sm:gap-5 items-center sm:items-start">
        <img
          src="./logo.png"
          className=" h-20 sm:h-30 w-auto absolute top-2 sm:top-4 left-4 sm:left-8"
          alt="Logo"
        />
        <div className="flex gap-2 items-center ml-25 mx-auto sm:ml-35 sm:mr-0 mt-9 sm:mt-13 px-3 py-1 rounded-full border border-gray-600">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: "#E9B13B" }}
          />
          <span className="text-xs sm:text-sm whitespace-nowrap">
            Smart. Fast. Reliable
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-5 mt-8 sm:mt-12 lg:mt-0 lg:pl-20">
        {/* Left Content */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left mt-8 lg:mt-30 px-4 sm:px-0">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
            Deliver more.
          </h1>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mt-2">
            Manage <span className="text-[#E9B13B]">everything.</span>
          </h1>
          <p className="py-4 sm:py-5 text-sm sm:text-base text-gray-300 max-w-full sm:max-w-md md:max-w-lg lg:w-100 mx-auto lg:mx-0">
            X is the all-in-one order delivery management platform that helps
            local and small businesses, track in real time and delight every
            customer
          </p>

          {/* Buttons */}
          {session && session?.user.role === "admin" && (
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 w-full sm:w-auto justify-center lg:justify-start">
              <Link
                href={"/dashboard"}
                className="backdrop-blur-lg bg-gradient-to-bl from-[#E9B13B] to-[#654808] border border-white/40 rounded-xl px-5 sm:px-6 py-2.5 sm:py-3 text-white font-bold shadow-xl transition-all hover:scale-105 duration-500 flex items-center justify-center gap-2"
              >
                Get Started <ArrowRight size={18} />
              </Link>
              <button className="backdrop-blur-lg border border-white/40 rounded-xl px-5 sm:px-6 py-2.5 sm:py-3 text-white font-bold shadow-xl transition-colors hover:border-[#E9B13B] duration-300 flex items-center justify-center gap-2">
                See How It Works <Play size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Right Image */}
        <div className="pr-20 flex justify-center lg:justify-end items-center mt-8 lg:mt-0">
          <img
            src="./hero.png"
            alt="Hero"
            className="w-full max-w-lg sm:max-w-lg md:max-w-xl lg:max-w-none h-auto lg:h-170 lg:w-230  lg:-ml-36 lg:-mt-20"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
