import Chat from '@/Chat';
import { useSession } from '@/hooks/useSession';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import LoginPage from './auth/Login';
import SignupPage from './auth/Signup';
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
      <Route path="/chat" element={<Chat />} />
      <Route path="*" element={<NotFound />} />
      <Route element={<AuthRoute />}>
        <Route path="/auth/signup" element={<SignupPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
};
