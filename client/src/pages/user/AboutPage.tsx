import AboutBanner from "../../components/about/AboutBanner";
import AboutContact from "../../components/about/AboutContact";
import AboutCustomer from "../../components/about/AboutCustomer";
import AboutReasons from "../../components/about/AboutReasons";
import AboutSystem from "../../components/about/AboutSystem";
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
