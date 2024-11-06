import { Link } from 'react-router-dom';
import Cal from '../../assets/cal.png';

const Home = () => {
  return (
    <div className='grid grid-cols-4 gap-4 mt-8 justify-items-center'>
      <Link
        to='/missed-or-late-dock-appointments'
        className='card image-full w-64 shadow-2xl'
      >
        <figure>
          <img src={Cal} alt='Calendar' />
        </figure>
        <div className='card-body'>
          <h2 className='card-title text-primary-content'>Dock Appointments</h2>
          <p className='text-primary-content'>
            Tracking for missed or late dock appointments
          </p>
        </div>
      </Link>
    </div>
  );
};

export default Home;
