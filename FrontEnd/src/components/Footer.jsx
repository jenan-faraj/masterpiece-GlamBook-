import React from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
} from "lucide-react";

export default function Footer() {
  // استخدام ألوان الموقع من المتغيرات
  const logoColor = "#8a5936";
  const buttonColor = "#a0714f";
  const textColor = "#c4a484";

  return (
    <footer dir="rtl" className="bg-stone-900 text-stone-200">
      {/* القسم الرئيسي للمعلومات */}
      <div className="container lg:px-20 mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* قسم عن الموقع */}
          <div>
            <h3 className="text-xl font-bold mb-4" style={{ color: logoColor }}>
              GlamBook
            </h3>
            <p className="mb-6" style={{ color: textColor }}>
              نقدم أفضل خدمات العناية بالجمال والشعر مع خبراء متخصصين وأحدث
              التقنيات لنضمن لكِ تجربة فريدة ومميزة.
            </p>
          </div>

          {/* قسم الروابط السريعة */}
          <div>
            <h3 className="text-xl font-bold mb-4" style={{ color: logoColor }}>
              روابط سريعة
            </h3>
            <ul className="space-y-3">
              {["الرئيسية", "الصالونات", "اضم إلينا", "اتصل بنا", "من نحن"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="hover:pr-2 transition-all duration-300 flex items-center"
                      style={{ color: textColor }}
                    >
                      <ChevronRight
                        size={16}
                        className="ml-1"
                        style={{ color: buttonColor }}
                      />
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* قسم الاتصال */}
          <div>
            <h3 className="text-xl font-bold mb-4" style={{ color: logoColor }}>
              اتصل بنا
            </h3>
            <ul className="space-y-4">
              <li
                className="flex items-start space-x-3 rtl:space-x-reverse"
                style={{ color: textColor }}
              >
                <MapPin
                  size={20}
                  style={{ color: buttonColor }}
                  className="mt-1 shrink-0"
                />
                <span>
                  الأردن, عمان، شارع الملكة رانيا العبدالله، مبنى رقم 123
                </span>
              </li>
              <li
                className="flex items-center space-x-3 rtl:space-x-reverse"
                style={{ color: textColor }}
              >
                <Phone
                  size={20}
                  style={{ color: buttonColor }}
                  className="shrink-0"
                />
                <span>+962 780 798 572</span>
              </li>
              <li
                className="flex items-center space-x-3 rtl:space-x-reverse"
                style={{ color: textColor }}
              >
                <Mail
                  size={20}
                  style={{ color: buttonColor }}
                  className="shrink-0"
                />
                <span>jenan.faraj4@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* وسائل التواصل الاجتماعي */}
        <div className="flex justify-center space-x-6 rtl:space-x-reverse mt-10 pt-6 border-t border-stone-700">
          {[Facebook, Instagram, Twitter].map((Icon, index) => (
            <a
              key={index}
              href="#"
              className="bg-stone-800 p-3 rounded-full hover:bg-opacity-80 transition-all duration-300"
              style={{ backgroundColor: buttonColor }}
            >
              <Icon size={20} color="white" />
            </a>
          ))}
        </div>
      </div>

      {/* شريط حقوق النشر */}
      <div
        className="bg-stone-950 py-4 text-center"
        style={{ color: textColor }}
      >
        <div className="container mx-auto px-4">
          <p dir="rtl" className="text-sm">
            جميع الحقوق محفوظة © {new Date().getFullYear()} GlamBook.
          </p>
        </div>
      </div>
    </footer>
  );
}
