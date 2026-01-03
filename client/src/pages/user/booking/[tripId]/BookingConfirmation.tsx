/**
 * Component: BookingConfirmation
 * Mục đích: Container chính cho trang Xác nhận đặt vé.
 * Tính năng:
 *  - Quản lý quy trình đặt vé 3 bước: Thông tin -> Thanh toán -> Hoàn tất.
 *  - Hiển thị Timeline (Stepper).
 *  - Lưu trữ dữ liệu form liên hệ (`contactData`).
 *  - Truyền dữ liệu chuyến đi (`tripData`) xuống các component con.
 */
import toast from "react-hot-toast";
import { useState } from "react";
import { Stepper, Step, StepLabel } from "@mui/material";
import ContactInfo from "./components/ContactInfo";
import TripDetails from "./components/TripDetails";
import type { ContactFormData } from "./components/useContactForm";
import QRPaymentPage from "./payment/QRPaymentPage";
import PaymentSuccessPage from "./success/PaymentSuccessPage";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useNavigate, useLocation } from "react-router-dom";
import { SHARED_TRIP, type TripData } from "./Shared/TripInfo";
import FooterBookingConfirmation from "./Shared/FooterBookingConfirmation";
import type { User } from "../../../../types";
import bookingService, { type Booking } from "../../../../services/bookingService";

// Steps definition
const STEPS = ["Thông tin liên hệ", "Thanh toán", "Hoàn tất"];

export default function BookingConfirmation() {
  const [activeStep, setActiveStep] = useState(0);

  // Helper for notifications
  const notify = (notifycation: string, status: boolean) => {
    if (status) {
      toast.success(notifycation);
    } else {
      toast.error(notifycation);
    }
  };

  // Mock handlers since state is in Header
  const changeLoginState = (login: boolean) => {
    console.log("Login state changed:", login);
    // In a real app with global state, we would dispatch an action here.
    // For now, we rely on authService updating localStorage, 
    // but the Header UI won't update until refresh.
    if (login) {
      // Force reload to update Header if needed, or just let it be silent
      // window.location.reload(); 
    }
  };

  const setUser = (user: User) => {
    console.log("User set:", user);
  };
  const [isContactValid, setIsContactValid] = useState(false);
  const [contactData, setContactData] = useState<ContactFormData>({
    fullName: "",
    phone: "",
    email: "",
    countryCode: "+84",
  });

  const navigate = useNavigate();

  const location = useLocation();
  const tripData = location.state?.trip as TripData || SHARED_TRIP;
  const selectedSeats = location.state?.selectedSeats || [];

  // Handlers
  const handleContinue = () => {
    if (activeStep === 0 && isContactValid) {
      setActiveStep(1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (activeStep === 1) {
      setActiveStep(0);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      const bookingData: Booking = {
        tripInfo: tripData,
        contactInfo: contactData,
        totalPrice: tripData.totalPrice,
        status: 'CONFIRMED',
        createdAt: new Date().toISOString(),
        paymentMethod: 'QR_PAYMENT'
      };

      const result = await bookingService.createBooking(bookingData, selectedSeats);

      if (result) {
        notify("Thanh toán và lưu vé thành công!", true);
        setActiveStep(2);
        window.scrollTo(0, 0);
      } else {
        notify("Thanh toán thành công nhưng không thể lưu vé. Vui lòng liên hệ CSKH.", false);
        setActiveStep(2); // Still advance but warn user
        window.scrollTo(0, 0);
      }
    } catch (error) {
      console.error("Booking error:", error);
      notify("Có lỗi xảy ra khi lưu vé.", false);
    }
  };

  const handleHome = () => {
    // Navigate home (mock)
    navigate("/");
  };

  const handleDataChange = (data: ContactFormData) => {
    setContactData(data);
  };

  // Render content based on step
  const renderContent = () => {
    if (activeStep === 1) {
      return (
        <QRPaymentPage
          onBack={handleBack}
          onSuccess={handlePaymentSuccess}
          tripData={tripData}
        />
      );
    }

    if (activeStep === 2) {
      return (
        <PaymentSuccessPage
          passengerInfo={contactData}
          tripData={tripData}
          onHome={handleHome}
        />
      );
    }

    // Default: Step 0 (Info)
    return (
      <div className="min-h-screen bg-[#f2f4f7] pb-[10rem]">
        <main className="max-w-6xl mx-auto px-4 pt-6">
          {/* Nút Quay lại */}
          <button className="flex items-center text-sm text-blue-600 font-medium mb-6 hover:underline ml-6 active:scale-95 hover:cursor-pointer">
            <ChevronLeftIcon fontSize="small" className="text-gray-400" />
            Quay lại
          </button>

          {/* Layout Chính: Grid 2 cột */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              <section>
                <ContactInfo
                  onValidationChange={setIsContactValid}
                  onDataChange={handleDataChange}
                  notify={notify}
                  changeLoginState={changeLoginState}
                  setUser={setUser}
                />
              </section>
            </div>

            <div className="lg:col-span-5 relative">
              <TripDetails trips={[tripData]} />
            </div>
          </div>
        </main>
        <FooterBookingConfirmation
          disabled={!isContactValid}
          onContinue={handleContinue}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f2f4f7]">
      {/* Timeline (Stepper) */}
      <div className="bg-white shadow-sm py-4 sticky top-0 z-10 ">
        <div className="max-w-4xl mx-auto py-2">
          <Stepper activeStep={activeStep} alternativeLabel>
            {STEPS.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>
      </div>

      {/* Current Step Content */}
      {renderContent()}
    </div>
  );
}
