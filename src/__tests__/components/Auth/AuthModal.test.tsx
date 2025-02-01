import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../../store/slices/authSlice';
import { AuthModal } from '../../../components/Auth/AuthModal';
import { login } from '../../../api/auth';

// Mock the auth API
jest.mock('../../../api/auth', () => ({
  login: jest.fn(() => Promise.resolve({ token: 'test-token' }))
}));

const store = configureStore({
  reducer: {
    auth: authReducer
  }
});

describe('AuthModal Component', () => {
  const mockProps = {
    isOpen: true,
    onClose: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form by default', () => {
    render(
      <Provider store={store}>
        <AuthModal {...mockProps} />
      </Provider>
    );

    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('switches to register form when toggle is clicked', () => {
    render(
      <Provider store={store}>
        <AuthModal {...mockProps} />
      </Provider>
    );

    const toggleLink = screen.getByText(/register/i);
    fireEvent.click(toggleLink);

    expect(screen.getByRole('heading', { name: /register/i })).toBeInTheDocument();
  });

  it('handles login submission', async () => {
    render(
      <Provider store={store}>
        <AuthModal {...mockProps} />
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'password123' }
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('displays error message on login failure', async () => {
    const mockError = { response: { data: { message: 'Invalid email or password' } } };
    (login as jest.Mock).mockRejectedValueOnce(mockError);

    render(
      <Provider store={store}>
        <AuthModal {...mockProps} />
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'wrong-password' }
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });
  });
});
