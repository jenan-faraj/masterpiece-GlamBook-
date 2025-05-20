import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";

const PaymentForm = ({
  totalAmount,
  onPaymentSuccess,
  selectedServices,
  salon,
  user,
}) => {
  const handlePaypalSuccess = async (details) => {
    try {
      const response = await axios.post("http://localhost:3000/api/payments", {
        amount: totalAmount,
        userId: user,
        salonId: salon,
        currency: "JOD",
        paymentMethod: "paypal",
        customer: {
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
      </div>

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
    </div>
  );
};

export default PaymentForm;
