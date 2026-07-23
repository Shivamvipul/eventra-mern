import { useSelector } from 'react-redux';

export const useAuth = () => {
  const { user, status, initialized } = useSelector((state) => state.auth);
  return {
    user,
    isAuthenticated: !!user,
    isLoading: status === 'loading',
    initialized,
    role: user?.role,
  };
};
