import React, { useEffect, useState } from "react";
import axios from "axios";
import { Star, Search, Filter } from "lucide-react";
import { Link } from "react-router-dom";

// StarRating component to display stars based on rating
const StarRating = ({ rating }) => {
  const numRating = parseFloat(rating);
  const fullStars = Math.floor(numRating);
  const hasHalfStar = numRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex justify-center">
      {/* Full stars */}
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          className="text-yellow-400 fill-yellow-400"
          size={16}
        />
      ))}

      {/* Half star */}
      {hasHalfStar && (
        <div className="relative">
          <Star className="text-yellow-400" size={16} />
          <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
            <Star className="text-yellow-400 fill-yellow-400" size={16} />
          </div>
        </div>
      )}

      {/* Empty stars */}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="text-yellow-400" size={16} />
      ))}
    </div>
  );
};

function Categories() {
  const [salons, setSalons] = useState([]);
  const [filteredSalons, setFilteredSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);

  const carouselItems = [
    {
      image: "./src/images/Hair.jpg",
      title: "Book with Ease!",
      description: "Glow with Confidence.",
    },
    {
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo9QuSWA0LxSz4xDVTsylvmcJ9uqVUqmM10w&s",
      title: "Beauty, Your Way",
      description: "Find & Book Your Perfect Salon!",
    },
    {
      image: "./src/images/contactBg.png",
      title: "Explore, Choose, Shine",
      description: "Your Beauty Journey Starts Here!",
    },
  ];

  // Fetch data from Firebase using Axios
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/salons")
      .then((response) => {
        // Convert Firebase data to array (as it comes as an object)
        const fetchedSalons = [];
        for (let key in response.data) {
          fetchedSalons.push({
            id: key,
            ...response.data[key],
          });
        }
        console.log(fetchedSalons);
        setSalons(fetchedSalons);
        setFilteredSalons(fetchedSalons);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  // Apply search and filter whenever either changes
  useEffect(() => {
    const filtered = salons.filter((salon) => {
      // Check if salon name includes search term (case insensitive)
      const nameMatch = salon.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Check if salon rating matches the filter (if set)
      const ratingMatch =
        ratingFilter === "" ||
        (parseFloat(salon.rating) >= parseFloat(ratingFilter) &&
          parseFloat(salon.rating) < parseFloat(ratingFilter) + 1);

      return nameMatch && ratingMatch;
    });

    setFilteredSalons(filtered);
  }, [searchTerm, ratingFilter, salons]);

  // Handler for search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  async function visitorsCount(salon) {
    if (!salon || !salon._id) {
      console.error("Invalid salon data");
      return;
    }

    const updatedData = { visitors: (salon.visitors || 0) + 1 };

    try {
      const response = await axios.put(
        `http://localhost:3000/api/salons/${salon._id}`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Salon updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error updating salon:",
        error.response?.data || error.message
      );
    }
  }

  // Handler for rating filter
  const handleRatingFilter = (e) => {
    setRatingFilter(e.target.value);
  };

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
      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 px-4 py-4 bg-white shadow-sm">
        {/* Search Bar */}
        <div className="relative w-full md:w-1/2 mb-4 md:mb-0">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
            placeholder="Search salons by name..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {/* Rating Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-700" />
          <label
            htmlFor="rating-filter"
            className="text-sm font-medium text-gray-700"
          >
            Filter by Rating:
          </label>
          <select
            id="rating-filter"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
            value={ratingFilter}
            onChange={handleRatingFilter}
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
            <option value="1">1+ Star</option>
          </select>
        </div>
      </div>

      {/* Salon Cards */}
      <div className="flex flex-wrap justify-evenly gap-5 my-10">
        {loading ? (
          <div className="w-full text-center py-8">Loading salons...</div>
        ) : error ? (
          <div className="w-full text-center py-8 text-red-500">
            Error loading salons. Please try again later.
          </div>
        ) : filteredSalons.length === 0 ? (
          <div className="w-full text-center py-8">
            No salons found matching your search criteria.
          </div>
        ) : (
          filteredSalons.map((salon) => {
            return (
              <div
                key={salon._id}
                className="group relative w-80 h-72 bg-slate-50 flex flex-col items-center justify-center gap-2 text-center rounded-2xl overflow-hidden shadow-md"
              >
                {/* Background image instead of gradient div */}
                <div className="absolute top-0 w-80 h-24 rounded-t-2xl overflow-hidden transition-all duration-500 group-hover:h-72 group-hover:w-80 group-hover:rounded-b-2xl">
                  <img
                    src={salon.bgImage || "https://i.pinimg.com/474x/81/3a/27/813a2759cb59a7e7def1f5f8e7fe6992.jpg"}
                    alt="Profile background"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Profile picture instead of blue circle */}
                <div className="w-28 h-28 mt-8 rounded-full border-4 border-slate-50 z-10 overflow-hidden group-hover:scale-150 group-hover:-translate-x-24 group-hover:-translate-y-20 transition-all duration-500">
                  <img
                    src={salon.profileImage || "https://i.pinimg.com/474x/81/3a/27/813a2759cb59a7e7def1f5f8e7fe6992.jpg"} 
                    alt="George Johnson"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="z-10 group-hover:-translate-y-10 bg-[#ffffff74] p-2 rounded-2xl transition-all duration-500">
                  <span className="text-2xl font-semibold">{salon.name}</span>
                  {/* Replace the plain rating text with star rating component */}
                  <div className="flex flex-col items-center">
                    <StarRating rating={salon.rating} />
                  </div>
                </div>

                <Link
                  onClick={() => visitorsCount(salon)} 
                  className="bg-[var(--Logo-color)] px-4 py-1 text-slate-50 rounded-md z-10 hover:scale-125 transition-all duration-500 hover:bg-[var(--button-color)]"
                  to={`/salonDetails/${salon._id}`}
                >
                  visit
                </Link>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}

export default Categories;
