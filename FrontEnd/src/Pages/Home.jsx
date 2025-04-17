import HeroSection from "../components/HeroSection";
import { Link } from "react-router-dom";

function Home() {
  const serviceCategories = [
    {
      title: "Hair Care",
      image:
        "https://i.pinimg.com/236x/30/a0/57/30a057cf785ad06cd2ecb18aa4b1b9f9.jpg",
    },
    {
      title: "Hair Removal",
      image:
        "./src/images/woman-cosmetology-studio-laser-hair-removal_1157-34891 1.png",
    },
    {
      title: "Skin Care",
      image:
        "./src/images/woman-having-beauty-treatment-procedures-salon_1303-28412 1.png",
    },
    {
      title: "Nail Care",
      image:
        "https://i.pinimg.com/236x/ad/d7/ee/add7ee9831c607781783a0208e046dae.jpg",
    },
    {
      title: "Makeup",
      image:
        "https://i.pinimg.com/236x/c3/87/e2/c387e2048658d814eb4615ff4f283ca5.jpg",
    },
    {
      title: "Brows & Lashes",
      image:
        "https://i.pinimg.com/236x/9e/9e/85/9e9e8546d52990a2f2175ab58db9fbda.jpg",
    },
  ];

  const features = [
    {
      icon: "./src/images/Screenshot 2025-01-22 223925.png",
      title: "Search & Discover Services",
      description: "Easily find your favorite places and services",
    },
    {
      icon: "./src/images/Screenshot 2025-01-22 223958.png",
      title: "View & Manage your Bookings",
      description: "Be in control of your own booking experience",
    },
    {
      icon: "./src/images/Screenshot 2025-01-22 224025.png",
      title: "Explore Real Time Availability",
      description: "Select available times and avoid booking conflicts",
    },
  ];
  return (
    <>
      <div className="w-full">
        <HeroSection />

        {/* Message Section */}
        <div className="container mx-auto my-20 px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-5/12">
              <img
                src="./src/images/Screenshot 2025-01-22 205958.png"
                alt="Medical Treatment"
                className="w-full rounded-lg"
              />
            </div>
            <div className="md:w-7/12">
              <h2 className="text-3xl font-bold mb-4">
                Discover & Book the Best Salons Near You!
              </h2>
              <p className="text-gray-600 mb-6">
                Finding the perfect salon has never been easier! 🌟 Whether you
                are looking for a haircut, makeup, nail care, or a full beauty
                experience, we have got you covered. Browse top-rated salons,
                check reviews, and book your appointment – all in one place!
              </p>
              <Link to={"/categories"}>
                <button className="bg-[#a0714f] hover:cursor-pointer text-white px-6 py-3 rounded-lg hover:bg-[#956542] transition-colors">
                  Get started
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="container mx-auto my-20 px-4">
          <h2 className="text-2xl font-bold text-[#8B5E3C] text-center mb-8">
            Sections:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceCategories.map((category, index) => (
              <Link to={"/categories"}>
                <div key={index} className="relative group">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-[400px] object-cover rounded-lg"
                  />
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <p className="bg-white bg-opacity-80 px-6 py-2 rounded-full text-[#c4a484] font-bold">
                      {category.title}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto my-20 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-[#E6F4F9] rounded-full flex items-center justify-center">
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    className="w-full h-full"
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Map Section */}
        <div className="container mx-auto my-20 px-4">
          <div className="bg-gray-50 rounded-lg shadow-lg p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-4/12 text-center">
                <img
                  src="./src/images/map.png"
                  alt="Map Icon"
                  className="w-full"
                />
              </div>
              <div className="md:w-8/12">
                <h3 className="text-2xl font-bold mb-4">
                  Find the Best Salons Near You!
                </h3>
                <h5 className="text-gray-600">
                  Discover top-rated salons in your area with just a few clicks.
                  Get directions, check reviews, and book your next beauty
                  session effortlessly.
                </h5>
              </div>
            </div>
          </div>
        </div>

        {/* Banner Section */}
        <div className="bg-[#e8effb] py-16 text-center my-16">
          <h2 className="text-3xl font-medium mb-4">Reduce Waiting Time</h2>
          <p className="text-lg">
            Win more time back into your life, arrive on time and get served
            quickly
          </p>
        </div>
      </div>
    </>
  );
}

export default Home;
