import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className='w-full h-screen flex flex-col items-center justify-center'>
      <p className='text-3xl text-error'>404: NotFound</p>
      <Link to='/' className='link'>
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
