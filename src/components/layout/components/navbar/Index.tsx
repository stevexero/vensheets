import useAuthStore from '../../../../stores/authStore';

const Navbar = () => {
  const { logout } = useAuthStore();

  return (
    <nav className='p-4 flex flex-row items-center justify-between'>
      <h1 className='text-3xl'>VenSheets</h1>
      <div className='flex flex-row items-center'>
        <button
          className='btn btn-primary btn-outline btn-sm ml-4'
          onClick={logout}
        >
          Log Out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
