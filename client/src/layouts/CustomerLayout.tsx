import { Outlet } from 'react-router-dom';
import Header from '../components/common/header';
import Footer from '../components/common/footer';

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