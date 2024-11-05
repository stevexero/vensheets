import { Outlet } from 'react-router-dom';
import Navbar from './components/navbar/Index';
import Footer from './components/footer/Index';

const Layout: React.FC = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <main className='flex-grow p-4'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;