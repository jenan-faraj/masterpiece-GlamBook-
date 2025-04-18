import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [floating, setFloating] = useState({});

  // Animation for floating elements
  useEffect(() => {
    const interval = setInterval(() => {
      setFloating({
        x: Math.sin(Date.now() / 1000) * 10,
        y: Math.cos(Date.now() / 1500) * 10,
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Here you would typically send the data to your backend
      const res = await fetch("http://localhost:3000/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setIsSubmitted(true);
        // Reset form after 3 seconds
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({ name: "", email: "", message: "" });
        }, 3000);
      } else {
        alert(data.error || "حدث خطأ");
      }
    } catch (error) {
      setLoading(false);
      alert("فشل إرسال النموذج");
    }
  };

  return (
    <div className="min-h-screen lg:px-20" dir="rtl">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <motion.div
          className="absolute w-32 h-32 rounded-full bg-[#a0714f] opacity-10 top-20 left-20"
          animate={{ x: floating.x, y: floating.y }}
          transition={{ duration: 2 }}
        />
        <motion.div
          className="absolute w-48 h-48 rounded-full bg-[#c4a484] opacity-5 bottom-40 right-10"
          animate={{ x: -floating.x, y: -floating.y }}
          transition={{ duration: 3 }}
        />
        <motion.div
          className="absolute w-24 h-24 rounded-full bg-[#a0714f] opacity-20 top-40 right-40"
          animate={{ x: -floating.y, y: floating.x }}
          transition={{ duration: 4 }}
        />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold text-[#a0714f] mb-4 font-arabic">
            تواصل معنا
          </h1>
          <div className="flex justify-center">
            <motion.div
              className="h-1 w-24 bg-[#c4a484] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: 100 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          <p className="text-[#a0714f] mt-6 max-w-2xl mx-auto text-xl font-arabic">
            نرحب بتواصلكم معنا. املأ النموذج أدناه وسنعود إليكم في أقرب وقت
            ممكن.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Contact Form */}
          <motion.div
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 border border-neutral-800 border-opacity-10 shadow-xl">
              {isSubmitted ? (
                <motion.div
                  className="text-center py-12"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#c4a484] mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-[#a0714f]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-[#a0714f] mb-2 font-arabic">
                    تم إرسال رسالتك بنجاح!
                  </h3>
                  <p className="text-[#a0714f] font-arabic">
                    سنتواصل معك قريباً
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 text-right">
                  <div>
                    <label className="block text-[#a0714f] mb-2 font-arabic">
                      الاسم
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-neutral-800 border-opacity-10 text-[#a0714f] focus:outline-none focus:ring-2 focus:ring-[#a0714f] transition-all duration-300 text-right"
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>

                  <div>
                    <label className="block text-[#a0714f] mb-2 font-arabic">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-neutral-800 border-opacity-10 text-[#a0714f] focus:outline-none focus:ring-2 focus:ring-[#a0714f] transition-all duration-300 text-right"
                      placeholder="example@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-[#a0714f] mb-2 font-arabic">
                      الرسالة
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-neutral-800 border-opacity-10 text-[#a0714f] focus:outline-none focus:ring-2 focus:ring-[#a0714f] transition-all duration-300 text-right"
                      placeholder="اكتب رسالتك هنا..."
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-6 bg-[#a0714f] hover:cursor-pointer hover:bg-[#8a6043] text-white font-bold rounded-lg shadow-lg transition-all duration-300 text-lg font-arabic"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? "جاري الإرسال..." : "إرسال الرسالة"}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="w-full lg:w-1/2 text-right"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-[#a0714f] mb-6 font-arabic">
                  معلومات الاتصال
                </h2>
                <p className="text-[#a0714f] mb-8 text-lg font-arabic">
                  يمكنك التواصل معنا مباشرة من خلال النموذج أو باستخدام أي من
                  طرق الاتصال التالية:
                </p>
              </div>

              <motion.div
                className="flex justify-end items-center gap-4 text-[#a0714f] transition-colors duration-300"
                whileHover={{ x: -5 }}
                dir="ltr"
              >
                <div>
                  <h3 className="font-bold text-xl mb-1 font-arabic">الهاتف</h3>
                  <p className="text-lg">+962 780798572</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#c4a484] bg-opacity-20 flex items-center justify-center shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
              </motion.div>

              <motion.div
                className="flex justify-end items-center gap-4 text-[#a0714f] transition-colors duration-300"
                whileHover={{ x: -5 }}
                dir="ltr"
              >
                <div>
                  <h3 className="font-bold text-xl mb-1 font-arabic">
                    البريد الإلكتروني
                  </h3>
                  <p className="text-lg">jenan.faraj4@gmail.com</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#c4a484] bg-opacity-20 flex items-center justify-center shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </motion.div>

              <motion.div
                className="flex justify-end items-center gap-4 text-[#a0714f] transition-colors duration-300"
                whileHover={{ x: -5 }}
                dir="ltr"
              >
                <div>
                  <h3 className="font-bold text-xl mb-1 font-arabic">
                    العنوان
                  </h3>
                  <p className="text-lg font-arabic">عمان، الأردن</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#c4a484] bg-opacity-20 flex items-center justify-center shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              </motion.div>

              <div className="pt-6 flex flex-col justify-end items-center">
                <h3 className="font-bold text-xl mb-4 text-[#a0714f] font-arabic">
                  تابعنا على
                </h3>
                <div className="flex gap-4 justify-end">
                  <motion.a
                    href="#"
                    className="w-10 h-10 rounded-full bg-[#c4a484] bg-opacity-10 flex items-center justify-center hover:bg-[#c4a484] transition-colors duration-300"
                    whileHover={{ y: -5 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[#a0714f]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                    </svg>
                  </motion.a>
                  <motion.a
                    href="#"
                    className="w-10 h-10 rounded-full bg-[#c4a484] bg-opacity-10 flex items-center justify-center hover:bg-[#c4a484] transition-colors duration-300"
                    whileHover={{ y: -5 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[#a0714f]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </motion.a>
                  <motion.a
                    href="#"
                    className="w-10 h-10 rounded-full bg-[#c4a484] bg-opacity-10 flex items-center justify-center hover:bg-[#c4a484] transition-colors duration-300"
                    whileHover={{ y: -5 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[#a0714f]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
