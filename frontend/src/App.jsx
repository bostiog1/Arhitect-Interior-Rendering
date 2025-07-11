import Contact from "./components/Contact";
import FloatingContact from "./components/FloatingContact";
import Footer from "./components/Footer";
import RenderConfigurator from "./components/RenderConfigurator";
import { Typography } from "@mui/material";
import titleImage from "./assets/title.png";

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
      <RenderConfigurator />
      <FloatingContact />
    </div>
  );
}

export default App;
