import { Outlet } from 'react-router-dom';
import Header from '../components/user/Header/header';
import Footer from '../components/user/Footer/footer';

const CustomerLayout = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default CustomerLayout;