import React, { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { login as loginAction } from '@/store/slices/authSlice';
import * as authApi from '@/api/auth';
import {
  ModalOverlay,
  ModalContent,
  ModalTitle,
  Form,
  Input,
  SubmitButton,
  ToggleLink,
  ErrorMessage
} from './styles';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ApiError {
  response?: {
    status: number;
    data?: {
      message?: string;
    };
  };
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  if (!isOpen) return null;

  const validateForm = () => {
    if (!email.includes('@')) {
      setError('Email must contain @');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isLogin) {
        const response = await authApi.login(email, password);
        localStorage.setItem('token', response.token);
        dispatch(loginAction({ email }));
      } else {
        try {
          const response = await authApi.register(email, password);
          localStorage.setItem('token', response.token);
          dispatch(loginAction({ email }));
        } catch (err) {
          const apiError = err as ApiError;
          if (apiError.response?.status === 409 || apiError.response?.data?.message?.includes('already exists')) {
            setError('User with this email already exists');
            setLoading(false);
            return;
          }
          throw err;
        }
      }
      onClose();
      setEmail('');
      setPassword('');
    } catch (_err) {
      if (isLogin) {
        setError('Invalid email or password');
        console.log(_err);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalTitle>{isLogin ? 'Login' : 'Register'}</ModalTitle>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
          </SubmitButton>
          <ToggleLink onClick={toggleMode}>
            {isLogin ? 'or Register' : 'or Login'}
          </ToggleLink>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};