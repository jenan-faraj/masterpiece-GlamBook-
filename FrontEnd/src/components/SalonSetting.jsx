import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
// يجب استيراد مكتبة toast
import { toast } from "react-toastify"; // أو أي مكتبة مماثلة تستخدمها

export default function SalonSetting({ salon: initialSalon }) {
  const [salon, setSalon] = useState(initialSalon);
  const [editingField, setEditingField] = useState("");
  const [updatedValue, setUpdatedValue] = useState("");
  const { id } = useParams();

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/salons/${salon._id}`,
        {
          [editingField]: updatedValue,
        }
      );

      // تحديث الواجهة بعد الحفظ:
      setSalon((prev) => ({
        ...prev,
        [editingField]: updatedValue,
      }));
      setEditingField(null);
      toast.success("تم تحديث المعلومات بنجاح");
    } catch (error) {
      console.error("Error updating salon info:", error);
      toast.error("فشل تحديث المعلومات");
    }
  };

  const handleTimeSave = async () => {
    if (!editingField) return;

    try {
      // Handle openingHours.day structure
      if (editingField.startsWith("openingHours.")) {
        const day = editingField.split(".")[1];

        // Create a deep copy of the current openingHours
        const updatedHours = JSON.parse(
          JSON.stringify(salon.openingHours || {})
        );

        // Update the specific day's hours
        updatedHours[day] = {
          open: updatedValue.open,
          close: updatedValue.close,
        };

        // Send update to API
        const response = await axios.put(
          `http://localhost:3000/api/salons/${salon._id}`,
          {
            openingHours: updatedHours,
          }
        );

        // Update salon state with response data
        setSalon(response.data);
      }

      setEditingField("");
      setUpdatedValue("");
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };
  return (
    <>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>

        <div className="divide-y">
          {/* Basic Information Section */}
          <div className="py-6">
            <h3 className="text-lg font-medium mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Salon Name
                </label>
                <input
                  type="text"
                  value={editingField === "name" ? updatedValue : salon.name}
                  onChange={(e) => setUpdatedValue(e.target.value)}
                  onFocus={() => {
                    setEditingField("name");
                    setUpdatedValue(salon.name);
                  }}
                  onBlur={handleSave}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--Logo-color)]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Owner Name
                </label>
                <input
                  type="text"
                  value={
                    editingField === "ownerName"
                      ? updatedValue
                      : salon.ownerName
                  }
                  onChange={(e) => setUpdatedValue(e.target.value)}
                  onFocus={() => {
                    setEditingField("ownerName");
                    setUpdatedValue(salon.ownerName);
                  }}
                  onBlur={handleSave}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--Logo-color)]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={
                    editingField === "location" ? updatedValue : salon.location
                  }
                  onChange={(e) => setUpdatedValue(e.target.value)}
                  onFocus={() => {
                    setEditingField("location");
                    setUpdatedValue(salon.location);
                  }}
                  onBlur={handleSave}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--Logo-color)]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Opening Year
                </label>
                <input
                  type="text"
                  value={
                    editingField === "openingYear"
                      ? updatedValue
                      : salon.openingYear
                  }
                  onChange={(e) => setUpdatedValue(e.target.value)}
                  onFocus={() => {
                    setEditingField("openingYear");
                    setUpdatedValue(salon.openingYear);
                  }}
                  onBlur={handleSave}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--Logo-color)]"
                />
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="py-6">
            <h3 className="text-lg font-medium mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={editingField === "email" ? updatedValue : salon.email}
                  onChange={(e) => setUpdatedValue(e.target.value)}
                  onFocus={() => {
                    setEditingField("email");
                    setUpdatedValue(salon.email);
                  }}
                  onBlur={handleSave}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--Logo-color)]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={editingField === "phone" ? updatedValue : salon.phone}
                  onChange={(e) => setUpdatedValue(e.target.value)}
                  onFocus={() => {
                    setEditingField("phone");
                    setUpdatedValue(salon.phone);
                  }}
                  onBlur={handleSave}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--Logo-color)]"
                />
              </div>
            </div>
          </div>

          {/* Business Hours Section */}
          <div className="py-6">
            <h3 className="text-lg font-medium mb-4">Business Hours</h3>

            {[
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "saturday",
              "sunday",
            ].map((day) => {
              const dayTranslation = {
                monday: "Monday",
                tuesday: "Tuesday",
                wednesday: "Wednesday",
                thursday: "Thursday",
                friday: "Friday",
                saturday: "Saturday",
                sunday: "Sunday",
              };

              return (
                <div key={day} className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-2">
                    {dayTranslation[day]}
                  </h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Opening Time
                      </label>
                      <input
                        type="text"
                        value={
                          editingField === `openingHours.${day}`
                            ? updatedValue.open
                            : salon.openingHours[day]?.open || ""
                        }
                        onChange={(e) =>
                          setUpdatedValue((prev) => ({
                            ...prev,
                            open: e.target.value,
                          }))
                        }
                        onFocus={() => {
                          setEditingField(`openingHours.${day}`);
                          setUpdatedValue({
                            open: salon.openingHours[day]?.open || "",
                            close: salon.openingHours[day]?.close || "",
                          });
                        }}
                        onBlur={handleTimeSave}
                        placeholder="e.g. 9:00 AM"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--Logo-color)]"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Closing Time
                      </label>
                      <input
                        type="text"
                        value={
                          editingField === `openingHours.${day}`
                            ? updatedValue.close
                            : salon.openingHours[day]?.close || ""
                        }
                        onChange={(e) =>
                          setUpdatedValue((prev) => ({
                            ...prev,
                            close: e.target.value,
                          }))
                        }
                        onFocus={() => {
                          setEditingField(`openingHours.${day}`);
                          setUpdatedValue({
                            open: salon.openingHours[day]?.open || "",
                            close: salon.openingHours[day]?.close || "",
                          });
                        }}
                        onBlur={handleTimeSave}
                        placeholder="e.g. 8:00 PM"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--Logo-color)]"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Salon Description Section */}
          <div className="py-6">
            <h3 className="text-lg font-medium mb-4">Salon Description</h3>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                About Your Salon
              </label>
              <textarea
                value={
                  editingField === "longDescription"
                    ? updatedValue
                    : salon.longDescription
                }
                onChange={(e) => setUpdatedValue(e.target.value)}
                onFocus={() => {
                  setEditingField("longDescription");
                  setUpdatedValue(salon.longDescription);
                }}
                onBlur={handleSave}
                rows="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--Logo-color)]"
              ></textarea>
            </div>
          </div>

          {/* Security Section */}
          <div className="py-6">
            <h3 className="text-lg font-medium mb-4">Security</h3>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Change Password
              </label>
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="password"
                  placeholder="Current Password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--Logo-color)]"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--Logo-color)]"
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--Logo-color)]"
                />
                <div>
                  <button className="bg-[var(--Logo-color)] text-white px-6 py-2 rounded-md hover:bg-[var(--button-color)] transition">
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
