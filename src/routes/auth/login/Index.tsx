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
    <div className='w-screen h-screen flex items-center justify-center'>
      <form
        onSubmit={handleLogin}
        className='flex flex-col items-center bg-neutral p-8 rounded-xl'
      >
        <div className='w-full'>
          <label className='label-text text-primary-content'>Username</label>
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
          <label className='label-text text-primary-content'>Password</label>
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
        {error && <p className='text-error mt-4'>{error}</p>}
        <button
          type='submit'
          className='btn btn-block btn-primary mt-12'
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

export default Login;
