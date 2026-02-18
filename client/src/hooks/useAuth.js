import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../services';
import { useAuthStore } from '../stores/authStore';

export const useLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success('Connexion réussie !');
      navigate('/dashboard');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Erreur de connexion');
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success('Inscription réussie !');
      navigate('/dashboard');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Erreur lors de l\'inscription');
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  return () => {
    logout();
    toast.success('Déconnexion réussie');
    navigate('/login');
  };
};
