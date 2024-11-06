import { DateTime } from 'luxon';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../../stores/authStore';

const Navbar = () => {
  const navigate = useNavigate();

  const { logout } = useAuthStore();

  const handleLogoutClick = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className='py-4 px-8 flex flex-row items-center justify-between bg-primary rounded-full shadow-xl mb-4'>
      <h1 className='text-primary-content font-bold'>VenSheets</h1>
      <div className='flex flex-row items-center'>
        <h2 className='text-primary-content'>{DateTime.now().toISODate()}</h2>
        <button
          className='btn btn-info text-info-content btn-outline btn-sm ml-4'
          onClick={handleLogoutClick}
        >
          Log Out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
