import { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Check, DollarSign, Phone, Mail } from "lucide-react";
import axios from "axios";

const PaymentForm = ({
  totalAmount,
  onPaymentSuccess,
  selectedServices,
  salon,
  user,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState({
    phone: "",
    email: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name in customer) {
      setCustomer({
        ...customer,
        [name]: value,
      });
    }
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleCliqPayment = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/api/bookings", {
        amount: totalAmount,
        userId: user,
        salonId: salon,
        currency: "JOD",
        paymentMethod: "paypal",
        customer: {
          ...customer,
          email: details.payer.email_address,
        },
        services: selectedServices,
      });

      if (response.status === 201 || response.status === 200) {
        onPaymentSuccess(response.data.transactionId);
      }
    } catch (error) {
      console.log(salon);
      console.log(user);
      console.error("فشل عملية الدفع:", error);
      alert("فشلت عملية الدفع. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaypalSuccess = async (details) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/api/payments", {
        amount: totalAmount,
        userId: user,
        salonId: salon,
        currency: "JOD",
        paymentMethod: "paypal",
        customer: {
          ...customer,
          email: details.payer.email_address,
        },
        services: selectedServices,
      });

      if (response.status === 201 || response.status === 200) {
        onPaymentSuccess(response.data.transactionId);
      }
    } catch (error) {
      console.log(salon);
      console.log(user);
      console.error("فشل عملية الدفع:", error);
      alert("فشلت عملية الدفع. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-[var(--Logo-color)]">
        إتمام عملية الدفع
      </h2>

      <div className="mb-6 p-4 bg-[var(--Logo-color)]/5 rounded-lg">
        <h3 className="font-medium text-center mb-3">ملخص الطلب</h3>
        <div className="bg-white p-4 rounded-md border border-[var(--Logo-color)]/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-500">المجموع</span>
            <span className="font-medium text-lg">{totalAmount} د.أ</span>
          </div>
          <div className="pt-3 border-t border-gray-100">
            <p className="text-gray-500 mb-2">الخدمات</p>
            <div className="flex flex-wrap gap-2">
              {selectedServices.map((service, index) => (
                <span
                  key={index}
                  className="bg-[var(--Logo-color)]/10 px-3 py-1 rounded-full text-sm text-[var(--Logo-color)]"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-medium mb-4">اختر طريقة الدفع</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handlePaymentMethodChange("paypal")}
            className={`p-4 border-2 rounded-lg flex items-center justify-center transition
              ${
                paymentMethod === "paypal"
                  ? "bg-[var(--Logo-color)]/10 border-[var(--Logo-color)]"
                  : "border-gray-200 hover:border-gray-300"
              }`}
          >
            <div className="flex items-center">
              <div
                className={`w-5 h-5 mr-3 rounded-full flex items-center justify-center border
                ${
                  paymentMethod === "paypal"
                    ? "border-[var(--Logo-color)] bg-[var(--Logo-color)]"
                    : "border-gray-300"
                }`}
              >
                {paymentMethod === "paypal" && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
              <div className="font-medium">PayPal</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handlePaymentMethodChange("cliq")}
            className={`p-4 border-2 rounded-lg flex items-center justify-center transition
              ${
                paymentMethod === "cliq"
                  ? "bg-[var(--Logo-color)]/10 border-[var(--Logo-color)]"
                  : "border-gray-200 hover:border-gray-300"
              }`}
          >
            <div className="flex items-center">
              <div
                className={`w-5 h-5 mr-3 rounded-full flex items-center justify-center border
                ${
                  paymentMethod === "cliq"
                    ? "border-[var(--Logo-color)] bg-[var(--Logo-color)]"
                    : "border-gray-300"
                }`}
              >
                {paymentMethod === "cliq" && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
              <div className="font-medium">CLIQ</div>
            </div>
          </button>
        </div>
      </div>

      {paymentMethod === "paypal" && (
        <div className="mb-6">
          <div className="mt-6">
            <PayPalScriptProvider
              options={{ "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID }}
            >
              <PayPalButtons
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          value: totalAmount,
                        },
                      },
                    ],
                  });
                }}
                onApprove={(data, actions) => {
                  return actions.order.capture().then((details) => {
                    handlePaypalSuccess(details);
                  });
                }}
                onError={(err) => {
                  console.error("PayPal error:", err);
                  alert("فشلت عملية الدفع عبر PayPal. يرجى المحاولة مرة أخرى.");
                }}
              />
            </PayPalScriptProvider>
          </div>
        </div>
      )}

      {paymentMethod === "cliq" && (
        <div className="mb-6">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              رقم الهاتف
            </label>
            <div className="relative">
              <Phone className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--Logo-color)]" />
              <input
                type="tel"
                name="phone"
                value={customer.phone}
                onChange={handleInputChange}
                placeholder="أدخل رقم هاتفك"
                className="w-full p-3 pr-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--Logo-color)]"
                required
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleCliqPayment}
            disabled={loading || !customer.phone}
            className={`w-full mt-4 p-3 bg-[var(--Logo-color)] text-white rounded-lg hover:bg-[var(--button-color)] transition-colors flex items-center justify-center
              ${
                loading || !customer.phone
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
          >
            {loading ? (
              "جاري المعالجة..."
            ) : (
              <>
                <DollarSign className="w-5 h-5 mr-2" />
                الدفع عبر CLIQ
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;
