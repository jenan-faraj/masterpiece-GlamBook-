import {
  Star,
  MapPin,
  Clock,
  Phone,
  Mail,
  Award,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import React, { useState } from "react";

export default function SalonInfo({ salon }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const daysTranslation = {
    monday: "الإثنين",
    tuesday: "الثلاثاء",
    wednesday: "الأربعاء",
    thursday: "الخميس",
    friday: "الجمعة",
    saturday: "السبت",
    sunday: "الأحد",
  };
  
  return (
    <>
      {/* Title and Buttons Section */}
      <div className="mt-24 flex flex-col md:flex-row justify-between items-start md:items-center px-6 md:px-10 mb-8">
        <div>
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-[var(--button-color)]">
              {salon.name}
            </h1>
          </div>
          <div className="flex items-center mt-2">
            <MapPin size={18} className="text-gray-500 mr-1" />
            <span className="text-gray-600">{salon.location}</span>

            <div className="flex items-center ml-4">
              <Star
                size={18}
                className="text-yellow-500 mr-1"
                fill="currentColor"
              />
              <span className="font-medium">{salon.rating}</span>
              <span className="text-gray-500 ml-1">
                ({salon.visitors} visitors)
              </span>
            </div>
          </div>
        </div>
        <div className="space-x-4 mt-4 md:mt-0">
          <Link to={`/book/${salon._id}`}>
            <button className="bg-[var(--Logo-color)] text-white px-6 py-2 rounded-md hover:bg-[var(--button-color)] transition">
              Book Now
            </button>
          </Link>
        </div>
      </div>

      {/* Salon Info Summary */}
      <div className="bg-white shadow-md rounded-lg mx-6 md:mx-10 p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="md:w-2/3 mb-6 md:mb-0">
            <h2 className="text-xl font-semibold mb-4">About {salon.name}</h2>
            <p className="text-gray-700">{salon.longDescription}</p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Phone */}
              <div className="flex items-center">
                <Phone size={20} className="text-[var(--Logo-color)] mr-2" />
                <span>{salon.phone}</span>
              </div>

              {/* Email */}
              <div className="flex items-center">
                <Mail size={20} className="text-[var(--Logo-color)] mr-2" />
                <span>{salon.email}</span>
              </div>

              {/* سنة الافتتاح */}
              <div className="flex items-center">
                <Award size={20} className="text-[var(--Logo-color)] mr-2" />
                <span className="capitalize">
                  تم الافتتاح عام {salon.openingYear}
                </span>
              </div>

              <div className="w-full">
                {/* عرض ملخص ساعات العمل عندما لا يكون موسعًا */}
                <div
                  className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  <div className="flex items-center">
                    <Clock
                      size={20}
                      className="text-[var(--Logo-color)] ml-2"
                    />
                    <span>ساعات العمل</span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp size={18} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-500" />
                  )}
                </div>

                {/* عرض تفاصيل ساعات العمل عند التوسيع */}
                {isExpanded && (
                  <div className="mt-2 pr-8 space-y-2">
                    {Object.keys(salon.openingHours).map((day) => {
                      const dayData = salon.openingHours[day];
                      const isOpen = dayData.open && dayData.close;

                      return (
                        <div key={day} className="flex justify-between text-sm">
                          <span className="font-medium">
                            {daysTranslation[day]}
                          </span>
                          <span
                            className={
                              isOpen ? "text-gray-700" : "text-gray-400"
                            }
                          >
                            {isOpen
                              ? `${dayData.open} - ${dayData.close}`
                              : "مغلق"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="md:w-1/3 border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6">
            <h3 className="text-lg font-medium mb-3">Salon Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Visitors</span>
                <span className="font-medium">{salon.visitors}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Services</span>
                <span className="font-medium">
                  {salon.services?.length || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Special Offers</span>
                <span className="font-medium">{salon.offers.length || 0}</span>
              </div>
              {/* اسم المالك */}
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Owner</span>
                <span className="capitalize">{salon.ownerName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
