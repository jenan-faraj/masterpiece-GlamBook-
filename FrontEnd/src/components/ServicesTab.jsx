import React, { useEffect, useState } from "react";
import axios from "axios";
import ServicePopup from "../components/ServicesPopup";
import { Trash2 } from "lucide-react";

const ServicesTab = ({ user, salon }) => {
  const [showModal, setShowModal] = useState(false);
  const [service, setService] = useState({
    title: "",
    images: [],
    category: "",
    duration: "",
    shortDescription: "",
    longDescription: "",
    price: "",
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [services, setServices] = useState(salon.services || []); // إضافة حالة لتخزين الخدمات

  const handleChange = (e) => {
    setService({ ...service, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Create preview URLs for selected images
    const newPreviewImages = files.map((file) => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...newPreviewImages]);

    // Store the file objects for upload
    const currentFiles = [...service.images, ...files];
    setService({ ...service, images: currentFiles });
  };

  const removeImage = (index) => {
    const updatedPreviews = [...previewImages];
    const updatedImages = [...service.images];

    // Release object URL to avoid memory leaks
    URL.revokeObjectURL(previewImages[index]);

    updatedPreviews.splice(index, 1);
    updatedImages.splice(index, 1);

    setPreviewImages(updatedPreviews);
    setService({ ...service, images: updatedImages });
  };

  const uploadImages = async (files) => {
    if (!files || files.length === 0) return [];

    setUploading(true);
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

    setUploading(false);
    return uploadedUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const imageUrls = await uploadImages(service.images);
      const newService = { ...service, images: imageUrls };
      const updatedServices = [...services, newService]; // Update the services state
      const response = await axios.put(
        `http://localhost:3000/api/salons/${salon._id}`,
        { services: updatedServices }
      );
      alert("Service added!");
      setShowModal(false);
      setService({
        title: "",
        images: [],
        category: "",
        duration: "",
        shortDescription: "",
        longDescription: "",
        price: "",
      });
      setPreviewImages([]);
      setServices(updatedServices); // Update the state with the new services list
    } catch (error) {
      console.error("Error adding service:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setIsPopupOpen(true);
  };

  const handleDeleteService = async (serviceId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/salons/${salon._id}/services/${serviceId}/delete`,
        {
          method: "PATCH",
        }
      );

      if (response.ok) {
        // Update the services state by filtering out the deleted service
        setServices(services.filter((service) => service._id !== serviceId));
      }
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-md w-full max-w-lg my-8">
            <h2 className="text-lg font-semibold mb-4">Add New Service</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="title"
                placeholder="Title"
                className="w-full p-2 border rounded"
                onChange={handleChange}
                required
              />
              <div className="border rounded p-3">
                <label className="block text-sm font-medium mb-2">
                  Service Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="w-full p-1 mb-2"
                />
                {previewImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {previewImages.map((src, index) => (
                      <div key={index} className="relative">
                        <img
                          src={src}
                          alt={`Preview ${index}`}
                          className="w-full h-24 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <input
                type="text"
                name="category"
                placeholder="Category"
                className="w-full p-2 border rounded"
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="duration"
                placeholder="Duration"
                className="w-full p-2 border rounded"
                onChange={handleChange}
                required
              />
              <textarea
                name="shortDescription"
                placeholder="Short Description"
                className="w-full p-2 border rounded"
                onChange={handleChange}
                required
              />
              <textarea
                name="longDescription"
                placeholder="Long Description"
                className="w-full p-2 border rounded"
                rows="4"
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                className="w-full p-2 border rounded"
                onChange={handleChange}
                required
              />
              <div className="flex justify-between mt-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className={`${
                    uploading ? "bg-gray-400" : "bg-green-500"
                  } text-white px-4 py-2 rounded flex items-center`}
                >
                  {uploading ? "Adding..." : "Add Service"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="bg-white flex justify-between m-5 items-center">
          <h2 className="text-xl font-semibold mb-6">Our Services</h2>
          {user.email === salon.email && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#825c41] hover:cursor-pointer hover:bg-[#a0714f] text-white px-4 py-2 rounded-md"
            >
              + Add Service
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services &&
            services
              .filter((service) => !service.isDeleted)
              .map((service, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow relative"
                >
                  {user.email === salon.email && (
                    <button
                      onClick={() => handleDeleteService(service._id)}
                      className="absolute top-2 right-2 hover:cursor-pointer p-1 bg-red-600 rounded-2xl text-white hover:bg-red-700"
                      title="Delete Service"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}

                  <div className="h-40 overflow-hidden rounded-md mb-4">
                    <img
                      onClick={() => handleServiceClick(service)}
                      src={service.images[0]}
                      alt={service.name}
                      className="w-full hover:cursor-pointer h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-medium">
                    {service.title || "service name"}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {service.shortDescription || "service description"}
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="font-bold text-[var(--Logo-color)]">
                      ${service.price || 100}
                    </span>
                  </div>
                </div>
              ))}

          {(!services ||
            services.filter((service) => !service.isDeleted).length === 0) && (
            <p className="text-gray-500 col-span-3 text-center py-10">
              No services available
            </p>
          )}
          <ServicePopup
            isOpen={isPopupOpen}
            onClose={closePopup}
            service={selectedService}
          />
        </div>
      </div>
    </div>
  );
};
export default ServicesTab;
