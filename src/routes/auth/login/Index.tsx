import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../stores/authStore';

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuthStore();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      const error = await login(email, password);

      if (error) {
        setError(error);
      } else {
        navigate('/');
      }
    } catch (err) {
      console.log(err);
      setError('Unexpected error occurred during sign-in');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setEmail(username + '@vensheets.com');
  }, [username]);

  return (
    <div className='w-screen h-screen grid grid-cols-3'>
      <div className='bg-orange-100 p-4 xl:p-14 col-span-3 md:col-span-2 lg:col-span-1 flex items-center justify-center'>
        <div className='h-full flex flex-col items-center justify-start'>
          <div className='bg-white w-full p-8 rounded-lg shadow-2xl mt-8'>
            <form
              onSubmit={handleLogin}
              className='w-full flex flex-col items-center'
            >
              <div className='w-full'>
                <label className='label-text'>Username</label>
                <input
                  type='text'
                  className='input input-bordered w-full'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete='username'
                />
              </div>
              <div className='mt-4 w-full'>
                <label className='label-text'>Password</label>
                <input
                  type='password'
                  className='input input-bordered w-full'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Enter your password'
                  required
                  autoComplete='current-password'
                />
              </div>
              {error && <p className='text-red-500 mt-4'>{error}</p>}
              <button
                type='submit'
                className='btn btn-block btn-error text-white mt-12'
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
