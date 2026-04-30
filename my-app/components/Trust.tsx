import { ClipboardCheck, Route, Timer } from "lucide-react";
import React from "react";

const Trust = () => {
  return (
    <div className="ml-20 mt-5">
      <h1 className=" text-3xl">
        Built for local shops and delivery businesses
      </h1>
      <div className=" flex gap-5 mt-5">
        <div className="bg-gradient-to-br w-80 from-[#E9B13B]/10 to-[#654808]/40 flex flex-col items-center hover:border-[#E9B13B] gap-3 backdrop-blur-sm rounded-xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer">
          <span className="bg-gradient-to-tl from-[#201701] to-[#E9B13B] p-3 rounded-full border border-yellow-500/40 backdrop-blur-2xl">
            <Timer size={40} />
          </span>
          <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Save hours Daily
          </h1>
        </div>
        <div className="bg-gradient-to-br w-80 from-[#E9B13B]/10 to-[#654808]/40 flex flex-col items-center hover:border-[#E9B13B] gap-3 backdrop-blur-sm rounded-xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer">
          <span className="bg-gradient-to-tl from-[#201701] to-[#E9B13B] p-3 rounded-full border border-yellow-500/40 backdrop-blur-2xl">
            <ClipboardCheck size={40} />
          </span>
          <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Stop losing orders
          </h1>
        </div>
        <div className="bg-gradient-to-br w-80 from-[#E9B13B]/10 to-[#654808]/40 flex flex-col items-center hover:border-[#E9B13B] gap-3 backdrop-blur-sm rounded-xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer">
          <span className="bg-gradient-to-tl from-[#201701] to-[#E9B13B] p-3 rounded-full border border-yellow-500/40 backdrop-blur-2xl">
            <Route size={40} />
          </span>
          <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Organize deliveries easily
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Trust;
