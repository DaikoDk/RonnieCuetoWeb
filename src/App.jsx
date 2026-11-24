import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import FormsStrip from "./components/FormsStrip.jsx";
import Services from "./components/Services.jsx";
import DebeHaber from "./components/DebeHaber.jsx";
import Tagline from "./components/Tagline.jsx";
import Steps from "./components/Steps.jsx";
import LeadForm from "./components/LeadForm.jsx";
import Faq from "./components/Faq.jsx";
import Closing from "./components/Closing.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <Nav />
      <main id="contenido">
        <Hero />
        <FormsStrip />
        <Services />
        <DebeHaber />
        <Tagline />
        <Steps />
        <LeadForm />
        <Faq />
        <Closing />
      </main>
      <Footer />
    </>
  );
}
