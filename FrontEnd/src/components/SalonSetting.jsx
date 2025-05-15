import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function SalonSetting({ salon: initialSalon }) {
  const [salon, setSalon] = useState(initialSalon);
  const [editingField, setEditingField] = useState("");
  const [updatedValue, setUpdatedValue] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    basicInfo: false,
    contactInfo: false,
    businessHours: false,
    description: false,
    security: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/salons/${salon._id}`,
        {
          [editingField]: updatedValue,
        }
      );

      setSalon((prev) => ({
        ...prev,
        [editingField]: updatedValue,
      }));
      setEditingField("");
      toast.success("تم تحديث المعلومات بنجاح");
    } catch (error) {
      console.error("Error updating salon info:", error);
      toast.error("فشل تحديث المعلومات");
    }
  };

  const handleCancel = () => {
    setEditingField("");
    setUpdatedValue("");
  };

  const handleTimeSave = async () => {
    if (!editingField) return;

    try {
      if (editingField.startsWith("openingHours.")) {
        const day = editingField.split(".")[1];
        const updatedHours = JSON.parse(
          JSON.stringify(salon.openingHours || {})
        );

        updatedHours[day] = {
          open: updatedValue.open,
          close: updatedValue.close,
        };

        const response = await axios.put(
          `http://localhost:3000/api/salons/${salon._id}`,
          {
            openingHours: updatedHours,
          }
        );

        setSalon(response.data);
      }

      setEditingField("");
      setUpdatedValue("");
      toast.success("تم تحديث ساعات العمل بنجاح");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("فشل تحديث ساعات العمل");
    }
  };

  const dayTranslation = {
    monday: "الإثنين",
    tuesday: "الثلاثاء",
    wednesday: "الأربعاء",
    thursday: "الخميس",
    friday: "الجمعة",
    saturday: "السبت",
    sunday: "الأحد",
  };

  const renderEditButtons = () => (
    <div className="flex space-x-2 mt-2 rtl:space-x-reverse">
      <button
        onClick={handleSave}
        className="bg-[var(--Logo-color)] text-white px-4 py-1 rounded-md hover:bg-[var(--button-color)] transition"
      >
        حفظ
      </button>
      <button
        onClick={handleCancel}
        className="bg-gray-300 text-gray-700 px-4 py-1 rounded-md hover:bg-gray-400 transition"
      >
        إلغاء
      </button>
    </div>
  );

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-[var(--Logo-color)]">
        إعدادات الصالون
      </h2>

      <div className="border-b border-gray-200 pb-4 mb-4">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection("basicInfo")}
        >
          <h3 className="text-lg font-medium text-[var(--Logo-color)]">
            المعلومات الأساسية
          </h3>
          <span className="text-xl">
            {expandedSections.basicInfo ? "−" : "+"}
          </span>
        </div>

        {expandedSections.basicInfo && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                اسم الصالون
              </label>
              <input
                type="text"
                value={editingField === "name" ? updatedValue : salon.name}
                onChange={(e) => setUpdatedValue(e.target.value)}
                onFocus={() => {
                  setEditingField("name");
                  setUpdatedValue(salon.name);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--Logo-color)]"
              />
              {editingField === "name" && renderEditButtons()}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                اسم المالك
              </label>
              <input
                type="text"
                value={
                  editingField === "ownerName" ? updatedValue : salon.ownerName
                }
                onChange={(e) => setUpdatedValue(e.target.value)}
                onFocus={() => {
                  setEditingField("ownerName");
                  setUpdatedValue(salon.ownerName);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--Logo-color)]"
              />
              {editingField === "ownerName" && renderEditButtons()}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                الموقع
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--Logo-color)]"
              />
              {editingField === "location" && renderEditButtons()}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                سنة الافتتاح
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--Logo-color)]"
              />
              {editingField === "openingYear" && renderEditButtons()}
            </div>
          </div>
        )}
      </div>

      <div className="border-b border-gray-200 pb-4 mb-4">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection("contactInfo")}
        >
          <h3 className="text-lg font-medium text-[var(--Logo-color)]">
            معلومات الاتصال
          </h3>
          <span className="text-xl">
            {expandedSections.contactInfo ? "−" : "+"}
          </span>
        </div>

        {expandedSections.contactInfo && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={editingField === "email" ? updatedValue : salon.email}
                onChange={(e) => setUpdatedValue(e.target.value)}
                onFocus={() => {
                  setEditingField("email");
                  setUpdatedValue(salon.email);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--Logo-color)]"
              />
              {editingField === "email" && renderEditButtons()}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                رقم الهاتف
              </label>
              <input
                type="text"
                value={editingField === "phone" ? updatedValue : salon.phone}
                onChange={(e) => setUpdatedValue(e.target.value)}
                onFocus={() => {
                  setEditingField("phone");
                  setUpdatedValue(salon.phone);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--Logo-color)]"
              />
              {editingField === "phone" && renderEditButtons()}
            </div>
          </div>
        )}
      </div>

      <div className="border-b border-gray-200 pb-4 mb-4">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection("businessHours")}
        >
          <h3 className="text-lg font-medium text-[var(--Logo-color)]">
            ساعات العمل
          </h3>
          <span className="text-xl">
            {expandedSections.businessHours ? "−" : "+"}
          </span>
        </div>

        {expandedSections.businessHours && (
          <div className="mt-4">
            {[
              "sunday",
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "saturday",
            ].map((day) => (
              <div key={day} className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">
                  {dayTranslation[day]}
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-600 text-sm mb-1">
                      وقت الفتح
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
                      placeholder="مثال: 9:00 ص"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--Logo-color)]"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 text-sm mb-1">
                      وقت الإغلاق
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
                      placeholder="مثال: 8:00 م"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--Logo-color)]"
                    />
                  </div>
                </div>
                {editingField === `openingHours.${day}` && (
                  <div className="flex space-x-2 mt-2 rtl:space-x-reverse">
                    <button
                      onClick={handleTimeSave}
                      className="bg-[var(--Logo-color)] text-white px-4 py-1 rounded-md hover:bg-[var(--button-color)] transition"
                    >
                      حفظ
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-300 text-gray-700 px-4 py-1 rounded-md hover:bg-gray-400 transition"
                    >
                      إلغاء
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-b border-gray-200 pb-4 mb-4">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection("description")}
        >
          <h3 className="text-lg font-medium text-[var(--Logo-color)]">
            وصف الصالون
          </h3>
          <span className="text-xl">
            {expandedSections.description ? "−" : "+"}
          </span>
        </div>

        {expandedSections.description && (
          <div className="mt-4">
            <label className="block text-gray-700 font-medium mb-2">
              وصف الصالون
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
              rows="5"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--Logo-color)]"
            ></textarea>
            {editingField === "longDescription" && renderEditButtons()}
          </div>
        )}
      </div>

      <div className="pb-4">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection("security")}
        >
          <h3 className="text-lg font-medium text-[var(--Logo-color)]">
            الأمان
          </h3>
          <span className="text-xl">
            {expandedSections.security ? "−" : "+"}
          </span>
        </div>

        {expandedSections.security && (
          <div className="mt-4">
            <label className="block text-gray-700 font-medium mb-2">
              تغيير كلمة المرور
            </label>
            <div className="grid grid-cols-1 gap-4 max-w-md">
              <div>
                <label className="block text-gray-600 text-sm mb-1">
                  كلمة المرور الحالية
                </label>
                <input
                  type="password"
                  placeholder="أدخل كلمة المرور الحالية"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--Logo-color)]"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm mb-1">
                  كلمة المرور الجديدة
                </label>
                <input
                  type="password"
                  placeholder="أدخل كلمة المرور الجديدة"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--Logo-color)]"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm mb-1">
                  تأكيد كلمة المرور الجديدة
                </label>
                <input
                  type="password"
                  placeholder="أعد إدخال كلمة المرور الجديدة"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--Logo-color)]"
                />
              </div>
              <div>
                <button className="bg-[var(--Logo-color)] text-white px-6 py-2 rounded-md hover:bg-[var(--button-color)] transition">
                  تحديث كلمة المرور
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
