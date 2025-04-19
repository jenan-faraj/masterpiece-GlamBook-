// components/Hero.jsx

import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative h-[91vh] w-full overflow-hidden">
      {/* الخلفية: الفيديو */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="../../public/Recording 2025-04-19 152930.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* محتوى الهيرو فوق الفيديو */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white bg-black/50">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">
          مرحباً بك في GlamBook
        </h1>
        <p className="text-lg md:text-2xl mb-6 text-center">
          احجزي صالونك المفضل خلال ثوانٍ
        </p>
        <Link to={"/categories"} className="bg-[#895a39] hover:cursor-pointer hover:bg-[#744a2c] text-2xl text-white font-semibold py-3 px-6 rounded-xl transition duration-300">
          ابدئي الآن
        </Link>
      </div>
    </div>
  );
};

export default Hero;
