import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import FloatingContact from "./components/FloatingContact";
import RenderConfigurator from "./components/RenderConfigurator";
import titleImage from "./assets/title.png";

// Load Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function App() {
  return (
    <div className="min-h-screen bg-white">
      <div className="text-center">
        <img
          src={titleImage}
          alt="Photographic Vision"
          className="w-full h-auto"
        />
      </div>

      {/* Wrap Stripe-enabled component */}
      <Elements stripe={stripePromise}>
        <RenderConfigurator />
      </Elements>

      <FloatingContact />
    </div>
  );
}

export default App;
