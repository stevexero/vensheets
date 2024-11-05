import { useEffect, useState } from 'react';
import useAuthStore from './stores/authStore';
import { Route, Routes } from 'react-router-dom';
import Login from './routes/auth/login/Index';
import Layout from './components/layout/Index';
import Home from './routes/home/Index';

function App() {
  const { session, initializeAuth } = useAuthStore();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuthOnLoad = async () => {
      setLoading(true);

      try {
        await initializeAuth();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthOnLoad();
  }, [initializeAuth]);

  if (loading) {
    return (
      <>
        <p>Loading...</p>
      </>
    );
  }

  return (
    <>
      <Routes>
        {session ? (
          <>
            <Route path='/' element={<Layout />}>
              <Route index element={<Home />} />
            </Route>
          </>
        ) : (
          <>
            <Route index element={<Login />} />
          </>
        )}
      </Routes>
    </>
  );
}

export default App;
