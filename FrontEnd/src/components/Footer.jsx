import { Link } from "react-router-dom";
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
  const logoColor = "#8a5936";
  const buttonColor = "#a0714f";
  const textColor = "#c4a484";

  return (
    <footer dir="rtl" className="bg-stone-900 text-stone-200">
      <div className="container mx-auto px-4 py-12 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <div className="h-16 mb-4">
              <h2 className="text-2xl font-bold" style={{ color: logoColor }}>
                بيــــــوتي
              </h2>
            </div>
            <p className="mb-6" style={{ color: textColor }}>
              نقدم أفضل خدمات العناية بالجمال والشعر مع خبراء متخصصين وأحدث
              التقنيات لنضمن لكِ تجربة فريدة ومميزة.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4" style={{ color: logoColor }}>
              روابط سريعة
            </h3>
            <ul className="space-y-3">
              {[
                { name: "الرئيسية", path: "/" },
                { name: "الصالونات", path: "/categories" },
                { name: "اضم إلينا", path: "/RegisterSalon" },
                { name: "اتصل بنا", path: "/ContactUs" },
                { name: "من نحن", path: "/aboutUs" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="hover:pr-2 transition-all duration-300 flex items-center"
                    style={{ color: textColor }}
                  >
                    <ChevronRight
                      size={16}
                      className="ml-1"
                      style={{ color: buttonColor }}
                    />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4" style={{ color: logoColor }}>
              اتصل بنا
            </h3>
            <ul className="space-y-4">
              <li
                className="flex items-start rtl:space-x-reverse"
                style={{ color: textColor }}
              >
                <MapPin
                  size={20}
                  style={{ color: buttonColor }}
                  className="mt-1 ml-2 shrink-0"
                />
                <a
                  href="https://maps.google.com/?q=الأردن,+عمان،+شارع+الملكة+رانيا+العبدالله"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: textColor }}
                  className="hover:underline"
                >
                  الأردن, عمان، شارع الملكة رانيا العبدالله، مبنى رقم 123
                </a>
              </li>
              <li
                className="flex items-center rtl:space-x-reverse"
                style={{ color: textColor }}
              >
                <Phone
                  size={20}
                  style={{ color: buttonColor }}
                  className="shrink-0 ml-2"
                />
                <a
                  href="tel:+962780798572"
                  style={{ color: textColor }}
                  className="hover:underline"
                >
                  +962 780 798 572
                </a>
              </li>
              <li
                className="flex items-center rtl:space-x-reverse"
                style={{ color: textColor }}
              >
                <Mail
                  size={20}
                  style={{ color: buttonColor }}
                  className="shrink-0 ml-2"
                />
                <a
                  href="mailto:jenan.faraj4@gmail.com"
                  style={{ color: textColor }}
                  className="hover:underline"
                >
                  jenan.faraj4@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex justify-center mt-10 pt-6 border-t border-stone-700">
          {[
            { Icon: Facebook, url: "https://facebook.com" },
            { Icon: Instagram, url: "https://instagram.com" },
            { Icon: Twitter, url: "https://twitter.com" },
          ].map(({ Icon, url }, index) => (
            <a
              key={index}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full hover:bg-opacity-80 transition-all duration-300 mx-2"
              style={{ backgroundColor: buttonColor }}
            >
              <Icon size={20} color="white" />
            </a>
          ))}
        </div>
      </div>

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
