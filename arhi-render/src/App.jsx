import Contact from "./components/Contact";
import FloatingContact from "./components/FloatingContact";
import Footer from "./components/Footer";
import RenderConfigurator from "./components/RenderConfigurator";
import { Typography } from "@mui/material";
import titleImage from "./assets/title.png";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <div className="text-center ">
        <img
          src={titleImage}
          alt="Photographic Vision"
          className="w-full h-auto"
        />
      </div>
      {/* <div className="text-center pt-6 md:pt-6">
        <Typography
          variant="h1"
          component="h1"
          className="text-slate-900 font-bold text-xl sm:text-2xl md:text-3xl"
        >
          PHOTOGRAPHIC VISION
        </Typography>
      </div> */}
      <RenderConfigurator />
      {/* <Contact /> */}
      <FloatingContact />
      {/* <Footer /> */}
    </div>
  );
}

export default App;
// import Contact from "./components/Contact";
// import FloatingContact from "./components/FloatingContact";
// import Footer from "./components/Footer";
// import RenderConfigurator from "./components/RenderConfigurator";

// function App() {
//   return (
//     <div className="min-h-screen bg-white">
//       <RenderConfigurator />
//       {/* <Contact /> */}
//       <FloatingContact />
//       {/* <Footer /> */}
//     </div>
//   );
// }

// export default App;
