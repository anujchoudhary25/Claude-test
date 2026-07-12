import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import WhoWeAre from "./components/WhoWeAre.jsx";
import Services from "./components/Services.jsx";
import TrustedBy from "./components/TrustedBy.jsx";
import OurWork from "./components/OurWork.jsx";
import Pricing from "./components/Pricing.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    <div className="bg-ink text-white">
      <Navbar />
      <main>
        <Hero />
        <WhoWeAre />
        <Services />
        <TrustedBy />
        <OurWork />
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
