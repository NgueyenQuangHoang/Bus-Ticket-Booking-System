import { Outlet } from 'react-router-dom';
import Header from '../components/user/Header/Header';
import Footer from '../components/user/Footer/Footer';

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