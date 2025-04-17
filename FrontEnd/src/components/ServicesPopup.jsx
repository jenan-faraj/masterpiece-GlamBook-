import React, { useState, useEffect } from "react";

const ServicePopup = ({ isOpen, onClose, service }) => {
  const [activeTab, setActiveTab] = useState("general");
  const [isPressing, setIsPressing] = useState(false);

  // Close the popup when pressing Escape
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [isOpen, onClose]);

  const hasContent = (content) => {
    return content && content.trim() !== "";
  };

  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300">
      <div
        className={`bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden ${
          isPressing
            ? "shadow-[0_0_20px_rgba(59,130,246,0.7)]"
            : "shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
        } transition-all duration-300 transform ${
          isPressing ? "scale-[0.99]" : "scale-100"
        }`}
        onMouseDown={() => setIsPressing(true)}
        onMouseUp={() => setIsPressing(false)}
        onMouseLeave={() => setIsPressing(false)}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#ddc3a9] to-[#835a35] p-5 flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#5d3716]">
            {service.title || "Service Details"}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-black/10"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-50 border-b border-gray-200 overflow-x-auto">
          {["Overview", "Content"].map((tab, index) => {
            const tabId = ["general", "content"][index];
            const isActive = activeTab === tabId;

            return (
              <button
                key={tabId}
                className={`px-5 py-4 font-medium text-sm flex-1 transition-all duration-300 ${
                  isActive
                    ? "text-[var(--primary-color)] border-b-2 border-[var(--primary-color)] bg-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab(tabId)}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6 bg-[#fafbfc]">
          {activeTab === "general" && (
            <div className="space-y-6 text-left">
              {[
                { label: "Service Name", value: service.title },
                { label: "Category", value: service.category },
                { label: "Duration", value: service.duration },
                { label: "Price", value: "$" + service.price },
              ].map((item, index) => (
                <div
                  key={index}
                  className="p-4 ltr bg-white rounded-lg shadow-sm border border-gray-100 hover:border-[var(--primary-color)] transition-colors"
                >
                  <div className="flex ltr gap-2 items-center">
                    <span className="text-[var(--primary-color)] font-bold">
                      {item.label}:
                    </span>
                    <span className="ltr text-gray-700">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "content" && (
            <div className="space-y-6 text-left">
              <div className="p-5 bg-white rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-[var(--primary-color)] mb-4 border-l-4 border-[var(--primary-color)] pl-3 ltr">
                  Service Content
                </h3>
                <div
                  className="service-container p-6 bg-white rounded-lg shadow-md space-y-6 ltr"
                  dir="ltr"
                >
                  <>
                    {/* Service Title */}
                    {hasContent(service.title) && (
                      <h2 className="text-2xl ltr font-bold text-gray-900">
                        {service.title}
                      </h2>
                    )}

                    {/* Service Description */}
                    {hasContent(service.shortDescription) && (
                      <div className="text-gray-700 ltr leading-relaxed">
                        <h2>{service.shortDescription}</h2>
                        <h1>{service.longDescription}</h1>
                      </div>
                    )}

                    {/* Images Section */}
                    {service.images && service.images.length > 0 && (
                      <div className="section-container bg-gray-50 p-4 rounded-md">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">
                          Service Images
                        </h4>
                        <div className="columns-2 gap-4">
                          {service.images.map((img, index) => (
                            <div
                              key={index}
                              className="mb-4 break-inside-avoid"
                            >
                              <img
                                src={img}
                                alt={`Service Image ${index + 1}`}
                                className="w-full rounded-md shadow-md"
                              />
                              {/* Optional: Add caption below image */}
                              {img.caption && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {img.caption}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Requirements Section */}
                    {hasContent(service.requirements) && (
                      <div className="section-container bg-gray-50 p-4 rounded-md">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">
                          Service Requirements
                        </h4>
                        <p className="text-gray-700 leading-relaxed">
                          {service.requirements}
                        </p>
                      </div>
                    )}

                    {/* Additional Info Section */}
                    {hasContent(service.additionalInfo) && (
                      <div className="section-container bg-gray-50 p-4 rounded-md">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">
                          Additional Information
                        </h4>
                        <p className="text-gray-700 leading-relaxed">
                          {service.additionalInfo}
                        </p>
                      </div>
                    )}
                  </>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServicePopup;
