import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../../store/slices/authSlice';
import { AuthButton } from '../../../components/Auth/AuthButton';

const store = configureStore({
  reducer: {
    auth: authReducer
  }
});

describe('AuthButton Component', () => {
  it('renders the button', () => {
    render(
      <Provider store={store}>
        <AuthButton isModalOpen={false} onModalToggle={() => {}} />
      </Provider>
    );
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeTruthy();
  });

  it('calls the onModalToggle handler when the button is clicked', () => {
    const handleModalToggle = jest.fn();
    render(
      <Provider store={store}>
        <AuthButton isModalOpen={false} onModalToggle={handleModalToggle} />
      </Provider>
    );
    const buttonElement = screen.getByRole('button');
    fireEvent.click(buttonElement);
    expect(handleModalToggle).toHaveBeenCalledTimes(1);
  });
});
