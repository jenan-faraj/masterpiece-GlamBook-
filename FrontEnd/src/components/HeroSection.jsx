import { useState } from "react";
import { Link } from "react-router-dom";

function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);

  const carouselItems = [
    {
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo9QuSWA0LxSz4xDVTsylvmcJ9uqVUqmM10w&s",
      title: "Beauty, Your Way",
      description: "Find & Book Your Perfect Salon!",
    },
    {
      image: "./src/images/contactBg.png",
      title: "Explore, Choose, Shine",
      description: "Your Beauty Journey Starts Here!",
    },
    {
      image: "./src/images/Hair.jpg",
      title: "Book with Ease!",
      description: "Glow with Confidence.",
    },
  ];

  return (
    <>
      <div className="relative w-full">
        <div className="relative h-[500px] overflow-hidden">
          {carouselItems.map((item, index) => (
            <div
              key={index}
              className={`absolute w-full h-full transition-opacity duration-500 ${
                index === activeSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute flex-col flex justify-center items-center bottom-0 left-0 right-0 p-8 text-white bg-[#00000030]">
                <h5 className="text-2xl font-bold">{item.title}</h5>
                <p className="text-lg">{item.description}</p>
                <Link to={"/categories"}>
                  <button className="bg-[#a0714f] hover:cursor-pointer text-white px-6 py-3 rounded-lg hover:bg-[#956542] transition-colors">
                    Get started
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() =>
            setActiveSlide((prev) =>
              prev === 0 ? carouselItems.length - 1 : prev - 1
            )
          }
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-[#eeeeee3b] text-white p-2 rounded-full"
        >
          ←
        </button>
        <button
          onClick={() =>
            setActiveSlide((prev) =>
              prev === carouselItems.length - 1 ? 0 : prev + 1
            )
          }
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[#eeeeee3b] text-white p-2 rounded-full"
        >
          →
        </button>
      </div>
    </>
  );
}
export default HeroSection;
