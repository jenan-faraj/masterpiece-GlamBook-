import { useState, useEffect } from 'react';

export default function HeroSection() {
  const heroContent = [
    {
      message: "استمتعي بتجربة صالون فاخرة من منزلك",
      subMessage: "احجزي موعدك الآن",
      imageUrl: "./src/images/contactBg.png",
      altText: "صالون تجميل فاخر"
    },
    {
      message: "أحدث صيحات الشعر والمكياج",
      subMessage: "خبراء متخصصون لإطلالة مثالية في كل مناسبة",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo9QuSWA0LxSz4xDVTsylvmcJ9uqVUqmM10w&s",
      altText: "تسريحات شعر عصرية"
    },
    {
      message: "عناية متكاملة للبشرة والجسم",
      subMessage: "استرخي مع باقات الخدمات المتكاملة بأسعار مميزة",
      imageUrl: "./src/images/contactBg.png",
      altText: "خدمات العناية بالبشرة"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroContent.length);
    }, 3000); // تغيير كل ثانيتين

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[91vh] w-full overflow-hidden">
      {/* صور الخلفية */}
      {heroContent.map((content, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={content.imageUrl}
            alt={content.altText}
            className="w-full h-full object-cover brightness-50"
          />
        </div>
      ))}

      {/* محتوى النص */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
        {heroContent.map((content, index) => (
          <div
            key={index}
            className={`text-center transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0 absolute'
            }`}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{content.message}</h1>
            <p className="text-xl md:text-2xl mb-8">{content.subMessage}</p>
          </div>
        ))}
      </div>

      {/* مؤشرات الشرائح */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2 rtl:space-x-reverse">
        {heroContent.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-3 w-3 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`الانتقال إلى الشريحة ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
}