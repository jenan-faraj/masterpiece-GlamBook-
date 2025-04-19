import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, Camera } from "lucide-react";
import Swal from "sweetalert2";

const SpecialOffers = ({ salon, user }) => {
  // Special Offers State
  const [showOffersModal, setShowOffersModal] = useState(false);
  const [offer, setOffer] = useState({
    title: "",
    images: [],
    description: "",
    endDate: "",
    originalPrice: "",
    discountPrice: "",
  });
  const [offerPreviewImages, setOfferPreviewImages] = useState([]);
  const [uploadingOffer, setUploadingOffer] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isOfferPopupOpen, setIsOfferPopupOpen] = useState(false);
  const [offers, setOffers] = useState(salon.offers || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load offers when component mounts
  useEffect(() => {
    setOffers(salon.offers || []);
  }, [salon]);

  // Submit offer
  const handleOfferSubmit = async (e) => {
    e.preventDefault();
    setUploadingOffer(true);
    try {
      const imageUrls = await uploadOfferImages(offer.images);

      const formattedOffer = {
        ...offer,
        images: imageUrls,
        originalPrice: Number(offer.originalPrice),
        discountPrice: Number(offer.discountPrice),
      };

      const updatedOffers = [...offers, formattedOffer];

      const response = await axios.put(
        `http://localhost:3000/api/salons/${salon._id}`,
        { offers: updatedOffers }
      );

      Swal.fire("Success", "Special offer added successfully!", "success");
      setShowOffersModal(false);
      setOffer({
        title: "",
        images: [],
        description: "",
        endDate: "",
        originalPrice: "",
        discountPrice: "",
      });
      setOfferPreviewImages([]);
      setOffers(updatedOffers);
    } catch (error) {
      console.error("Error adding special offer:", error);
      Swal.fire(
        "Error",
        "Failed to add special offer. Please try again.",
        "error"
      );
    } finally {
      setUploadingOffer(false);
    }
  };

  // Delete offer
  const handleDeleteOffer = async (offerId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this offer?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/salons/${salon._id}/offers/${offerId}/delete`,
          {
            method: "PATCH",
          }
        );

        if (response.ok) {
          setOffers(offers.filter((offer) => offer._id !== offerId));
          Swal.fire("Deleted!", "Offer deleted successfully.", "success");
        } else {
          const errorData = await response.json();
          Swal.fire(
            "Failed",
            `Failed to delete offer: ${errorData.message}`,
            "error"
          );
        }
      } catch (error) {
        console.error("Error deleting offer:", error);
        Swal.fire("Error", "Error deleting offer", "error");
      }
    }
  };

  // Handle form field changes
  const handleOfferChange = (e) => {
    setOffer({ ...offer, [e.target.name]: e.target.value });
  };

  // Handle image selection
  const handleOfferImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Create preview URLs for selected images
    const newPreviewImages = files.map((file) => URL.createObjectURL(file));
    setOfferPreviewImages([...offerPreviewImages, ...newPreviewImages]);

    // Store the file objects for upload
    const currentFiles = [...offer.images, ...files];
    setOffer({ ...offer, images: currentFiles });
  };

  // Remove selected image
  const removeOfferImage = (index) => {
    const updatedPreviews = [...offerPreviewImages];
    const updatedImages = [...offer.images];

    // Release object URL to avoid memory leaks
    URL.revokeObjectURL(offerPreviewImages[index]);

    updatedPreviews.splice(index, 1);
    updatedImages.splice(index, 1);

    setOfferPreviewImages(updatedPreviews);
    setOffer({ ...offer, images: updatedImages });
  };

  // Upload images to server
  const uploadOfferImages = async (files) => {
    if (!files || files.length === 0) return [];

    setUploadingOffer(true);
    const uploadedUrls = [];

    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await axios.post(
          "http://localhost:3000/api/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        uploadedUrls.push(response.data.url);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }

    setUploadingOffer(false);
    return uploadedUrls;
  };

  // Handle offer click
  const handleOfferClick = (offer) => {
    setSelectedOffer(offer);
    setIsOfferPopupOpen(true);
  };

  // Reset form when modal closes
  const handleCloseModal = () => {
    setShowOffersModal(false);
    setOffer({
      title: "",
      images: [],
      description: "",
      endDate: "",
      originalPrice: "",
      discountPrice: "",
    });
    setOfferPreviewImages([]);
  };

  const visibleOffers = offers.filter((offer) => !offer.isDeleted);

  return (
    <div className="my-8">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold">Special Offers</h2>
        {user && user.email === salon.email && (
          <button
            className="bg-[#825c41] hover:cursor-pointer hover:bg-[#a0714f] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => setShowOffersModal(true)}
          >
            Add Special Offer
          </button>
        )}
      </div>

      {/* Special Offers Modal */}
      {showOffersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-2xl max-h-90vh overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold">Add Special Offer</h3>
              <button
                className="text-2xl focus:outline-none"
                onClick={handleCloseModal}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleOfferSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block font-bold mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={offer.title}
                  onChange={handleOfferChange}
                  required
                  placeholder="Enter offer title"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="images" className="block font-bold mb-1">
                  Images
                </label>
                <input
                  type="file"
                  id="images"
                  multiple
                  onChange={handleOfferImageChange}
                  accept="image/*"
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <div className="flex flex-wrap gap-3 mt-3">
                  {offerPreviewImages.map((preview, index) => (
                    <div key={index} className="relative w-24 h-24">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeOfferImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="block font-bold mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={offer.description}
                  onChange={handleOfferChange}
                  required
                  placeholder="Enter offer description"
                  rows="4"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="endDate" className="block font-bold mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={offer.endDate}
                  onChange={handleOfferChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <label
                    htmlFor="originalPrice"
                    className="block font-bold mb-1"
                  >
                    Original Price
                  </label>
                  <input
                    type="number"
                    id="originalPrice"
                    name="originalPrice"
                    value={offer.originalPrice}
                    onChange={handleOfferChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div className="flex-1">
                  <label
                    htmlFor="discountPrice"
                    className="block font-bold mb-1"
                  >
                    Discount Price
                  </label>
                  <input
                    type="number"
                    id="discountPrice"
                    name="discountPrice"
                    value={offer.discountPrice}
                    onChange={handleOfferChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 bg-green-500 text-white rounded ${
                    uploadingOffer
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-green-600"
                  }`}
                  disabled={uploadingOffer}
                >
                  {uploadingOffer ? "Adding..." : "Add Offer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Offers List */}
      <div className="mt-5">
        {loading ? (
          <p className="text-center py-8 text-gray-500">Loading offers...</p>
        ) : error ? (
          <p className="text-center py-8 text-red-500">
            Error loading offers. Please try again.
          </p>
        ) : visibleOffers && visibleOffers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
            {visibleOffers.map((offerItem, index) => (
              <div
                key={index}
                className="relative border rounded-lg p-4 hover:shadow-md transition-shadow bg-gradient-to-r from-pink-50 to-white cursor-pointer"
                onClick={() => handleOfferClick(offerItem)}
              >
                {/* Delete button */}
                {user && user.email === salon.email && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteOffer(offerItem._id);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                    title="Delete offer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}

                <div className="flex">
                  <div className="w-1/3 pr-4">
                    <div className="h-32 rounded-md overflow-hidden">
                      <img
                        src={
                          offerItem.images && offerItem.images.length > 0
                            ? offerItem.images[0]
                            : salon.profileImage
                        }
                        alt={offerItem.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="w-2/3">
                    <div className="bg-[#fff5eb] border border-[#B58152] text-[#B58152] font-bold rounded-full px-3 py-1 text-xs inline-block mb-2">
                      Special offer
                    </div>
                    <h3 className="text-lg font-medium text-[#B58152]">
                      {offerItem.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {offerItem.description}
                    </p>
                    <div className="mt-2 flex justify-between items-center">
                      <div>
                        <span className="line-through text-gray-500 text-sm">
                          ${offerItem.originalPrice}
                        </span>
                        <span className="text-[#B58152] font-bold ml-2">
                          ${offerItem.discountPrice}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar size={14} className="mr-1" />
                        <span>
                          Ends{" "}
                          {new Date(offerItem.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-8 text-gray-500">
            No special offers available.
          </p>
        )}
      </div>

      {/* Offer Details Popup */}
      {isOfferPopupOpen && selectedOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-3xl max-h-90vh overflow-y-auto relative">
            <button
              className="absolute top-3 right-3 text-2xl focus:outline-none"
              onClick={() => setIsOfferPopupOpen(false)}
            >
              ×
            </button>

            <h3 className="text-2xl font-bold mb-4">{selectedOffer.title}</h3>

            {selectedOffer.images && selectedOffer.images.length > 0 && (
              <div className="flex overflow-x-auto gap-3 mb-5 pb-2">
                {selectedOffer.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${selectedOffer.title} image ${i + 1}`}
                    className="h-64 object-cover rounded"
                  />
                ))}
              </div>
            )}

            <div className="mb-5 leading-relaxed">
              <p>{selectedOffer.description}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded mb-3">
              <p className="mb-2">
                Valid until:{" "}
                <strong>
                  {new Date(selectedOffer.endDate).toLocaleDateString()}
                </strong>
              </p>
              <div className="mt-3">
                <p>
                  Original Price:{" "}
                  <span className="line-through text-gray-500">
                    ${selectedOffer.originalPrice}
                  </span>
                </p>
                <p>
                  Discount Price:{" "}
                  <span className="font-bold text-red-600">
                    ${selectedOffer.discountPrice}
                  </span>
                </p>
                <p>
                  You save:{" "}
                  <span className="font-bold text-green-600">
                    $
                    {(
                      selectedOffer.originalPrice - selectedOffer.discountPrice
                    ).toFixed(2)}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecialOffers;
