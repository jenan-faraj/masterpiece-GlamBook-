import { useState, useEffect } from "react";
import axios from "axios";

export default function SalonRegistrationForm() {
  const [formData, setFormData] = useState({
    name: "",
    ownerName: "",
    email: "",
    password: "",
    phone: "",
    location: "",
    salonOwnershipImages: [],
    identityImages: [],
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Preview images for UI display
  const [previewImages, setPreviewImages] = useState({
    salonOwnershipImages: [],
    identityImages: [],
  });

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      // Clean up all preview URLs
      Object.values(previewImages)
        .flat()
        .forEach((preview) => {
          if (preview) URL.revokeObjectURL(preview);
        });
    };
  }, [previewImages]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const files = Array.from(e.target.files);

    if (files.length > 0) {
      // Create preview URLs for the images
      const newPreviewImages = files.map((file) => URL.createObjectURL(file));

      // Update preview images for UI display
      setPreviewImages((prevPreviews) => ({
        ...prevPreviews,
        [name]: [...prevPreviews[name], ...newPreviewImages],
      }));

      // Store the file objects for upload
      setFormData((prevData) => ({
        ...prevData,
        [name]: [...prevData[name], ...files],
      }));
    }
  };

  const removeImage = (type, index) => {
    // Release object URL to avoid memory leaks
    URL.revokeObjectURL(previewImages[type][index]);

    // Remove the image from previews and formData
    setPreviewImages((prevPreviews) => ({
      ...prevPreviews,
      [type]: prevPreviews[type].filter((_, i) => i !== index),
    }));

    setFormData((prevData) => ({
      ...prevData,
      [type]: prevData[type].filter((_, i) => i !== index),
    }));
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
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      // First upload all images
      const salonOwnershipUrls = await uploadImages(
        formData.salonOwnershipImages
      );
      const identityImageUrls = await uploadImages(formData.identityImages);

      // Prepare the form data object with uploaded image URLs
      const submitData = {
        name: formData.name,
        ownerName: formData.ownerName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        location: formData.location,
        salonOwnershipImagePreview: salonOwnershipUrls,
        identityImagePreview: identityImageUrls,
      };

      console.log("Submitting form data", submitData);

      const response = await fetch("http://localhost:3000/api/salons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        setMessage({ text: "Salon registered successfully!", type: "success" });

        // Reset form after successful submission
        setFormData({
          name: "",
          ownerName: "",
          email: "",
          password: "",
          phone: "",
          location: "",
          salonOwnershipImages: [],
          identityImages: [],
        });

        setPreviewImages({
          salonOwnershipImages: [],
          identityImages: [],
        });
      } else {
        const errorData = await response.json();
        setMessage({
          text: errorData.message || "Registration failed",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage({
        text: "An error occurred during registration",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-[var(--button-color)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="p-8 w-full">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-[var(--button-color)]">
                Register New Salon
              </h2>
              <p className="mt-2 text-gray-600">
                Enter your salon details to register on our platform
              </p>
            </div>

            {message.text && (
              <div
                className={`p-4 mb-4 rounded-md ${
                  message.type === "success"
                    ? "bg-green-50 text-green-800"
                    : "bg-red-50 text-red-800"
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Salon Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Salon Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--button-color)] focus:border-[var(--button-color)]"
                  placeholder="Enter salon name"
                />
              </div>

              {/* Owner Name */}
              <div>
                <label
                  htmlFor="ownerName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Owner Name
                </label>
                <input
                  id="ownerName"
                  name="ownerName"
                  type="text"
                  required
                  value={formData.ownerName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--button-color)] focus:border-[var(--button-color)]"
                  placeholder="Enter owner's full name"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--button-color)] focus:border-[var(--button-color)]"
                  placeholder="your@email.com"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--button-color)] focus:border-[var(--button-color)]"
                  placeholder="Enter a secure password"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--button-color)] focus:border-[var(--button-color)]"
                  placeholder="Enter phone number"
                />
              </div>

              {/* Location */}
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Salon Location
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--button-color)] focus:border-[var(--button-color)]"
                  placeholder="Enter salon location"
                />
              </div>

              {/* Image Uploads */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Salon Ownership Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  name="salonOwnershipImages"
                  onChange={handleFileChange}
                  className="w-full text-sm"
                />
                {previewImages.salonOwnershipImages.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {previewImages.salonOwnershipImages.map(
                      (preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`salon-ownership-preview-${index}`}
                            className="h-20 w-20 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              removeImage("salonOwnershipImages", index)
                            }
                            className="absolute top-0 right-0 text-red-500 bg-white p-1 rounded-full"
                          >
                            &times;
                          </button>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Identity Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  name="identityImages"
                  onChange={handleFileChange}
                  className="w-full text-sm"
                />
                {previewImages.identityImages.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {previewImages.identityImages.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`identity-image-preview-${index}`}
                          className="h-20 w-20 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage("identityImages", index)}
                          className="absolute top-0 right-0 text-red-500 bg-white p-1 rounded-full"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="w-full py-2 px-4 bg-[var(--button-color)] text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--button-color)]"
                >
                  {loading || uploading ? "Processing..." : "Register Salon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
