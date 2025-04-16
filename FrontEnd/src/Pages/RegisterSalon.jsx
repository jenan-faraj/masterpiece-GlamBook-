// import { useState, useEffect } from "react";

// export default function SalonRegistrationForm() {
//   const [formData, setFormData] = useState({
//     name: "",
//     ownerName: "",
//     email: "",
//     password: "",
//     phone: "",
//     location: "",
//     salonOwnershipImagePreview: [],
//     identityImagePreview: [],
//   });

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ text: "", type: "" });
//   const [previewImages, setPreviewImages] = useState({
//     salonOwnershipImagePreview: [],
//     identityImagePreview: [],
//   });

//   // Clean up object URLs when component unmounts
//   useEffect(() => {
//     return () => {
//       [
//         ...previewImages.salonOwnershipImagePreview,
//         ...previewImages.identityImagePreview,
//       ].forEach((preview) => {
//         if (preview) URL.revokeObjectURL(preview);
//       });
//     };
//   }, [previewImages]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleFileChange = (e) => {
//     const { name } = e.target;
//     const files = Array.from(e.target.files);

//     if (files.length > 0) {
//       // Create preview URLs for the images
//       const previewUrls = files.map((file) => URL.createObjectURL(file));

//       // Store the preview URLs in formData as links
//       setFormData((prevData) => ({
//         ...prevData,
//         [name]: [...prevData[name], ...previewUrls],
//       }));

//       // Store preview URLs for UI display
//       setPreviewImages((prevPreviews) => ({
//         ...prevPreviews,
//         [name]: [...prevPreviews[name], ...previewUrls],
//       }));
//     }
//   };

//   const removeImage = (type, index) => {
//     // Remove the image URL from formData
//     setFormData((prevData) => ({
//       ...prevData,
//       [type]: prevData[type].filter((_, i) => i !== index),
//     }));

//     // Remove the preview URL
//     setPreviewImages((prevPreviews) => ({
//       ...prevPreviews,
//       [type]: prevPreviews[type].filter((_, i) => i !== index),
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage({ text: "", type: "" });

//     try {
//       // Create FormData for the text fields
//       const submitData = new FormData();

//       // Add text fields
//       submitData.append("name", formData.name);
//       submitData.append("ownerName", formData.ownerName);
//       submitData.append("email", formData.email);
//       submitData.append("password", formData.password);
//       submitData.append("phone", formData.phone);
//       submitData.append("location", formData.location);

//       // Add image URLs as strings instead of file objects
//       formData.salonOwnershipImagePreview.forEach((url) => {
//         submitData.append("salonOwnershipImagePreview", url);
//       });

//       formData.identityImagePreview.forEach((url) => {
//         submitData.append("identityImagePreview", url);
//       });

//       console.log("Submitting form data", formData);

//       const response = await fetch("http://localhost:3000/api/salons", {
//         method: "POST",
//         body: formData,
//       });

//       if (response.ok) {
//         setMessage({ text: "Salon registered successfully!", type: "success" });

//         // Reset form after successful submission
//         setFormData({
//           name: "",
//           ownerName: "",
//           email: "",
//           password: "",
//           phone: "",
//           location: "",
//           salonOwnershipImagePreview: [],
//           identityImagePreview: [],
//         });

//         setPreviewImages({
//           salonOwnershipImagePreview: [],
//           identityImagePreview: [],
//         });
//       } else {
//         const errorData = await response.json();
//         setMessage({
//           text: errorData.message || "Registration failed",
//           type: "error",
//         });
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       setMessage({
//         text: "An error occurred during registration",
//         type: "error",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-[var(--button-color)] py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
//         <div className="md:flex">
//           <div className="p-8 w-full">
//             <div className="text-center mb-6">
//               <h2 className="text-2xl font-bold text-[var(--button-color)]">
//                 Register New Salon
//               </h2>
//               <p className="mt-2 text-gray-600">
//                 Enter your salon details to register on our platform
//               </p>
//             </div>

//             {message.text && (
//               <div
//                 className={`p-4 mb-4 rounded-md ${
//                   message.type === "success"
//                     ? "bg-green-50 text-green-800"
//                     : "bg-red-50 text-red-800"
//                 }`}
//               >
//                 {message.text}
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Salon Name */}
//               <div>
//                 <label
//                   htmlFor="name"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Salon Name
//                 </label>
//                 <input
//                   id="name"
//                   name="name"
//                   type="text"
//                   required
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--button-color)] focus:border-[var(--button-color)]"
//                   placeholder="Enter salon name"
//                 />
//               </div>

//               {/* Owner Name */}
//               <div>
//                 <label
//                   htmlFor="ownerName"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Owner Name
//                 </label>
//                 <input
//                   id="ownerName"
//                   name="ownerName"
//                   type="text"
//                   required
//                   value={formData.ownerName}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--button-color)] focus:border-[var(--button-color)]"
//                   placeholder="Enter owner's full name"
//                 />
//               </div>

//               {/* Email */}
//               <div>
//                 <label
//                   htmlFor="email"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Email Address
//                 </label>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   required
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--button-color)] focus:border-[var(--button-color)]"
//                   placeholder="your@email.com"
//                 />
//               </div>

//               {/* Password */}
//               <div>
//                 <label
//                   htmlFor="password"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Password
//                 </label>
//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
//                   required
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--button-color)] focus:border-[var(--button-color)]"
//                   placeholder="Enter a secure password"
//                 />
//               </div>

//               {/* Phone */}
//               <div>
//                 <label
//                   htmlFor="phone"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Phone Number
//                 </label>
//                 <input
//                   id="phone"
//                   name="phone"
//                   type="tel"
//                   required
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--button-color)] focus:border-[var(--button-color)]"
//                   placeholder="Enter phone number"
//                 />
//               </div>

//               {/* Location */}
//               <div>
//                 <label
//                   htmlFor="location"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Salon Location
//                 </label>
//                 <input
//                   id="location"
//                   name="location"
//                   type="text"
//                   required
//                   value={formData.location}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--button-color)] focus:border-[var(--button-color)]"
//                   placeholder="Enter salon location"
//                 />
//               </div>

//               {/* Upload Images */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Upload Salon Ownership & Identity Images
//                 </label>

//                 {/* Salon Ownership Images */}
//                 <input
//                   type="file"
//                   name="salonOwnershipImagePreview"
//                   accept="image/*"
//                   multiple
//                   onChange={handleFileChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--button-color)] focus:border-[var(--button-color)]"
//                 />
//                 <div className="mt-2">
//                   {previewImages.salonOwnershipImagePreview.map(
//                     (url, index) => (
//                       <div
//                         key={index}
//                         className="flex items-center space-x-2 mb-2"
//                       >
//                         <img
//                           src={url}
//                           alt={`salon ownership preview ${index}`}
//                           className="w-20 h-20 object-cover rounded-md"
//                         />
//                         <button
//                           type="button"
//                           onClick={() =>
//                             removeImage("salonOwnershipImagePreview", index)
//                           }
//                           className="text-red-500 hover:text-red-700"
//                         >
//                           Remove
//                         </button>
//                       </div>
//                     )
//                   )}
//                 </div>

//                 {/* Identity Images */}
//                 <input
//                   type="file"
//                   name="identityImagePreview"
//                   accept="image/*"
//                   multiple
//                   onChange={handleFileChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--button-color)] focus:border-[var(--button-color)]"
//                 />
//                 <div className="mt-2">
//                   {previewImages.identityImagePreview.map((url, index) => (
//                     <div
//                       key={index}
//                       className="flex items-center space-x-2 mb-2"
//                     >
//                       <img
//                         src={url}
//                         alt={`identity preview ${index}`}
//                         className="w-20 h-20 object-cover rounded-md"
//                       />
//                       <button
//                         type="button"
//                         onClick={() =>
//                           removeImage("identityImagePreview", index)
//                         }
//                         className="text-red-500 hover:text-red-700"
//                       >
//                         Remove
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Submit Button */}
//               <div className="flex justify-center">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full bg-[var(--button-color)] hover:bg-[var(--button-color)] text-white font-semibold py-2 px-4 rounded-md shadow-md disabled:opacity-50"
//                 >
//                   {loading ? "Submitting..." : "Submit"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from "react";

export default function SalonRegistrationForm() {
  const [formData, setFormData] = useState({
    name: "",
    ownerName: "",
    email: "",
    password: "",
    phone: "",
    location: "",
    salonOwnershipImagePreview: [],
    identityImagePreview: [],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [previewImages, setPreviewImages] = useState({
    salonOwnershipImagePreview: [],
    identityImagePreview: [],
  });

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      [
        ...previewImages.salonOwnershipImagePreview,
        ...previewImages.identityImagePreview,
      ].forEach((preview) => {
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
      const previewUrls = files.map((file) => URL.createObjectURL(file));

      // Store the preview URLs in formData as links
      setFormData((prevData) => ({
        ...prevData,
        [name]: [...prevData[name], ...previewUrls],
      }));

      // Store preview URLs for UI display
      setPreviewImages((prevPreviews) => ({
        ...prevPreviews,
        [name]: [...prevPreviews[name], ...previewUrls],
      }));
    }
  };

  const removeImage = (type, index) => {
    // Remove the image URL from formData
    setFormData((prevData) => ({
      ...prevData,
      [type]: prevData[type].filter((_, i) => i !== index),
    }));

    // Remove the preview URL
    setPreviewImages((prevPreviews) => ({
      ...prevPreviews,
      [type]: prevPreviews[type].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      // Prepare the form data object
      const submitData = {
        name: formData.name,
        ownerName: formData.ownerName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        location: formData.location,
        salonOwnershipImagePreview: formData.salonOwnershipImagePreview,
        identityImagePreview: formData.identityImagePreview,
      };

      console.log("Submitting form data", submitData);

      const response = await fetch("http://localhost:3000/api/salons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set the correct content type
        },
        body: JSON.stringify(submitData), // Send as JSON
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
          salonOwnershipImagePreview: [],
          identityImagePreview: [],
        });

        setPreviewImages({
          salonOwnershipImagePreview: [],
          identityImagePreview: [],
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
                  name="salonOwnershipImagePreview"
                  onChange={handleFileChange}
                  className="w-full text-sm"
                />
                {previewImages.salonOwnershipImagePreview.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {previewImages.salonOwnershipImagePreview.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`salon-ownership-preview-${index}`}
                          className="h-20 w-20 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage("salonOwnershipImagePreview", index)}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Identity Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  name="identityImagePreview"
                  onChange={handleFileChange}
                  className="w-full text-sm"
                />
                {previewImages.identityImagePreview.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {previewImages.identityImagePreview.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`identity-image-preview-${index}`}
                          className="h-20 w-20 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage("identityImagePreview", index)}
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
                  disabled={loading}
                  className="w-full py-2 px-4 bg-[var(--button-color)] text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--button-color)]"
                >
                  {loading ? "Registering..." : "Register Salon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
