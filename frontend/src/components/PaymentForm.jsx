// // src/PaymentForm.jsx
// import React, { useState } from "react";
// import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// const PaymentForm = ({
//   amount,
//   onPaymentSuccess,
//   onPaymentError,
//   fileDetails,
// }) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState(null);

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setLoading(true);
//     setErrorMessage(null);

//     if (!stripe || !elements) {
//       // Stripe.js has not yet loaded.
//       return;
//     }

//     try {
//       // Step 1: Request PaymentIntent from your backend, including client info
//       const response = await fetch(
//         // "http://localhost:3001/api/create-payment-intent",
//         "https://arhitect-interior-rendering-6lzv.vercel.app/api/create-payment-intent",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             amount: Math.round(amount * 100), // Send amount in cents
//             currency: "usd",
//             deliveryDate: fileDetails.deliveryDate, // Add this
//             notes: fileDetails.notes, // Add this too
//             fileName: fileDetails.name,
//             fileType: fileDetails.type,
//             fileSize: fileDetails.size,
//             clientName: fileDetails.clientName, // NEW: Pass client name
//             clientEmail: fileDetails.clientEmail, // NEW: Pass client email
//             clientPhone: fileDetails.clientPhone, // NEW: Pass client phone
//             deliveryDate: fileDetails.deliveryDate, // ADD
//             notes: fileDetails.notes, // ADD
//             uploadType: fileDetails.uploadType, // ADD
//             fileLink: fileDetails.fileLink, // ADD
//           }),
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Failed to create payment intent.");
//       }

//       const { clientSecret, orderId, paymentIntentId } = await response.json();

//       // Step 2: Confirm the payment with Stripe
//       const result = await stripe.confirmCardPayment(clientSecret, {
//         payment_method: {
//           card: elements.getElement(CardElement),
//           billing_details: {
//             name: fileDetails.clientName,
//             email: fileDetails.clientEmail,
//           },
//         },
//       });

//       if (result.error) {
//         setErrorMessage(result.error.message);
//         onPaymentError(result.error.message);
//       } else {
//         if (result.paymentIntent.status === "succeeded") {
//           console.log("Payment Succeeded!", result.paymentIntent);
//           // Call the success handler, passing orderId and paymentIntentId
//           onPaymentSuccess(orderId, result.paymentIntent.id);
//         } else {
//           setErrorMessage(`Payment status: ${result.paymentIntent.status}`);
//           onPaymentError(`Payment status: ${result.paymentIntent.status}`);
//         }
//       }
//     } catch (error) {
//       console.error("Payment submission error:", error);
//       setErrorMessage(error.message);
//       onPaymentError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="p-6 bg-[#1c1c44] border-2 border-white rounded-xl shadow-lg"
//     >
//       <h3 className="text-white text-xl font-bold mb-4">Payment Details</h3>
//       <div className="mb-4 p-3 border border-white/50 rounded-lg">
//         <CardElement
//           options={{
//             style: {
//               base: {
//                 color: "#ffffff",
//                 fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
//                 fontSmoothing: "antialiased",
//                 fontSize: "16px",
//                 "::placeholder": {
//                   color: "#aab7c4",
//                 },
//               },
//               invalid: {
//                 color: "#fa755a",
//                 iconColor: "#fa755a",
//               },
//             },
//           }}
//         />
//       </div>
//       {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
//       <button
//         type="submit"
//         disabled={!stripe || loading}
//         className={`w-full py-3 rounded-xl font-bold transition-all duration-200 ${
//           !stripe || loading
//             ? "bg-gray-600 text-gray-400 cursor-not-allowed"
//             : "bg-blue-500 text-white hover:bg-blue-600"
//         }`}
//       >
//         {loading ? "Processing..." : `Pay $${amount}`}
//       </button>
//     </form>
//   );
// };

// export default PaymentForm;

import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { CreditCard, Lock, DollarSign } from "lucide-react";

const PaymentForm = ({
  amount,
  onPaymentSuccess,
  onPaymentError,
  fileDetails,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    if (!stripe || !elements) {
      return;
    }

    try {
      const response = await fetch(
        "https://arhitect-interior-rendering-6lzv.vercel.app/api/create-payment-intent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Math.round(amount * 100),
            currency: "usd",
            deliveryDate: fileDetails.deliveryDate,
            notes: fileDetails.notes,
            fileName: fileDetails.name,
            fileType: fileDetails.type,
            fileSize: fileDetails.size,
            clientName: fileDetails.clientName,
            clientEmail: fileDetails.clientEmail,
            clientPhone: fileDetails.clientPhone,
            uploadType: fileDetails.uploadType,
            fileLink: fileDetails.fileLink,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create payment intent.");
      }

      const { clientSecret, orderId, paymentIntentId } = await response.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: fileDetails.clientName,
            email: fileDetails.clientEmail,
          },
        },
      });

      if (result.error) {
        setErrorMessage(result.error.message);
        onPaymentError(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          console.log("Payment Succeeded!", result.paymentIntent);
          onPaymentSuccess(orderId, result.paymentIntent.id);
        } else {
          setErrorMessage(`Payment status: ${result.paymentIntent.status}`);
          onPaymentError(`Payment status: ${result.paymentIntent.status}`);
        }
      }
    } catch (error) {
      console.error("Payment submission error:", error);
      setErrorMessage(error.message);
      onPaymentError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 sm:p-8 bg-gradient-to-br from-[#1c1c44] to-[#2a2a6b] border-2 border-white/30 rounded-2xl shadow-2xl backdrop-blur-sm"
    >
      {/* Header Section */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-white/10 rounded-xl">
          <CreditCard className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h3 className="text-white text-2xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            Payment Details
          </h3>
          <p className="text-gray-300 text-sm">
            Secure payment powered by Stripe
          </p>
        </div>
      </div>

      {/* Amount Display */}
      <div className="mb-6 p-4 bg-white/5 border border-white/20 rounded-xl backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-300 font-medium">Total Amount:</span>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            <span className="text-2xl font-bold text-white">{amount}</span>
          </div>
        </div>
      </div>

      {/* Card Input Section */}
      <div className="mb-6">
        <label className="block text-white font-semibold text-lg mb-3">
          Card Information
        </label>
        <div className="p-4 bg-white/5 border-2 border-white/20 rounded-xl backdrop-blur-sm hover:border-white/30 transition-all duration-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400/30">
          <CardElement
            options={{
              style: {
                base: {
                  color: "#ffffff",
                  fontFamily:
                    '"Inter", "Helvetica Neue", Helvetica, sans-serif',
                  fontSmoothing: "antialiased",
                  fontSize: "16px",
                  fontWeight: "400",
                  "::placeholder": {
                    color: "#9CA3AF",
                  },
                },
                invalid: {
                  color: "#EF4444",
                  iconColor: "#EF4444",
                },
                complete: {
                  color: "#10B981",
                  iconColor: "#10B981",
                },
              },
            }}
          />
        </div>
      </div>

      {/* Security Notice */}
      <div className="flex items-center gap-2 mb-6 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
        <Lock className="w-4 h-4 text-green-400" />
        <span className="text-green-300 text-sm">
          Your payment information is encrypted and secure
        </span>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-red-300 text-sm font-medium">{errorMessage}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform ${
          !stripe || loading
            ? "bg-gray-700 text-gray-400 cursor-not-allowed scale-100"
            : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:scale-105 shadow-lg hover:shadow-blue-500/25"
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Processing Payment...</span>
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" />
              <span>Secure Payment - ${amount}</span>
            </>
          )}
        </div>
      </button>

      {/* Footer Text */}
      <p className="text-center text-gray-400 text-xs mt-4">
        By completing this payment, you agree to our terms of service
      </p>
    </form>
  );
};

export default PaymentForm;
