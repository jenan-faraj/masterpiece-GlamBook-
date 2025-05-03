import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // تحديد متى سيظهر الزر (بعد التمرير لأسفل بمقدار معين)
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // إضافة مستمع حدث التمرير
    window.addEventListener("scroll", toggleVisibility);

    // تنظيف المستمع عند فك تحميل المكون
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // وظيفة التمرير لأعلى
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 rounded-full bg-[#B58152] text-white shadow-lg transition-all duration-300 hover:bg-[#a0714f] hover:shadow-xl hover:scale-110 z-50"
          aria-label="الرجوع لأعلى الصفحة"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </>
  );
};

export default ScrollToTopButton;
