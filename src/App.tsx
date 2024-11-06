import { useEffect, useState } from 'react';
import useAuthStore from './stores/authStore';
import { Route, Routes } from 'react-router-dom';
import Login from './routes/auth/login/Index';
import Layout from './components/layout/Index';
import Home from './routes/home/Index';
import MissedOrLateDockAppointments from './routes/missedorlatedockappointments/Index';
import NotFound from './routes/notfound/Index';

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
              <Route
                path='missed-or-late-dock-appointments'
                element={<MissedOrLateDockAppointments />}
              />
            </Route>
          </>
        ) : (
          <>
            <Route index element={<Login />} />
          </>
        )}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
