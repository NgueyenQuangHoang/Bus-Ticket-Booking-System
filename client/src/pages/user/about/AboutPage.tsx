import AboutBanner from "./components/AboutBanner";
import AboutContact from "./components/AboutContact";
import AboutCustomer from "./components/AboutCustomer";
import AboutReasons from "./components/AboutReasons";
import AboutSystem from "./components/AboutSystem";
export default function AboutPage() {
  return (
    <div>
      <AboutBanner />
      <AboutSystem />
      <AboutReasons />
      <AboutCustomer />
      <AboutContact />
    </div>
  );
}
