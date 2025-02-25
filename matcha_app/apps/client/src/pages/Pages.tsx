import { useSession } from '@/hooks/useSession';
import { getUrl } from '@matcha/common';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import LoginPage from './auth/Login';
import SignupPage from './auth/Signup';
// import Chat from './Chat';
import { Home } from './Home';
import { NotFound } from './NotFound';

const AuthRoute = () => {
  const { user, loading } = useSession();

  if (loading) {
    return <div>Loading...</div>;
  }
  if (user) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

const PrivateRoute = () => {
  const { user, loading } = useSession();

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/auth/login"></Navigate>;
  }
  return <Outlet />;
};

export const Pages = () => {
  return (
    <Routes>
      <Route path="*" element={<NotFound />} />
      <Route element={<AuthRoute />}>
        <Route
          path={getUrl('client-auth', {
            type: 'signup',
          })}
          element={<SignupPage />}
        />
        <Route
          path={getUrl('client-auth', {
            type: 'login',
          })}
          element={<LoginPage />}
        />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Home />} />
        {/* <Route path="/chat" element={<Chat />} /> */}
      </Route>
    </Routes>
  );
};
