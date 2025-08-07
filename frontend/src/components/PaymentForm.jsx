// src/PaymentForm.jsx
import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

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
      // Stripe.js has not yet loaded.
      return;
    }

    try {
      // Step 1: Request PaymentIntent from your backend, including client info
      const response = await fetch(
        // "http://localhost:3001/api/create-payment-intent",
        "https://arhitect-interior-rendering-6lzv.vercel.app/api/create-payment-intent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Math.round(amount * 100), // Send amount in cents
            currency: "usd",
            deliveryDate: fileDetails.deliveryDate, // Add this
            notes: fileDetails.notes, // Add this too
            fileName: fileDetails.name,
            fileType: fileDetails.type,
            fileSize: fileDetails.size,
            clientName: fileDetails.clientName, // NEW: Pass client name
            clientEmail: fileDetails.clientEmail, // NEW: Pass client email
            clientPhone: fileDetails.clientPhone, // NEW: Pass client phone
            deliveryDate: fileDetails.deliveryDate, // ADD
            notes: fileDetails.notes, // ADD
            uploadType: fileDetails.uploadType, // ADD
            fileLink: fileDetails.fileLink, // ADD
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create payment intent.");
      }

      const { clientSecret, orderId, paymentIntentId } = await response.json();

      // Step 2: Confirm the payment with Stripe
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
          // Call the success handler, passing orderId and paymentIntentId
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
      className="p-6 bg-[#1c1c44] border-2 border-white rounded-xl shadow-lg"
    >
      <h3 className="text-white text-xl font-bold mb-4">Payment Details</h3>
      <div className="mb-4 p-3 border border-white/50 rounded-lg">
        <CardElement
          options={{
            style: {
              base: {
                color: "#ffffff",
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: "antialiased",
                fontSize: "16px",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#fa755a",
                iconColor: "#fa755a",
              },
            },
          }}
        />
      </div>
      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full py-3 rounded-xl font-bold transition-all duration-200 ${
          !stripe || loading
            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        {loading ? "Processing..." : `Pay $${amount}`}
      </button>
    </form>
  );
};

export default PaymentForm;
