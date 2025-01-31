import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { AuthModal } from './AuthModal';
import styled from '@emotion/styled';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';

const IconButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: color 0.2s;

  &:hover {
    color: #f57c00;
  }

  &:focus {
    outline: none;
    user-select: none;
  }
`;

interface AuthButtonProps {
  isModalOpen: boolean;
  onModalToggle: (isOpen: boolean) => void;
}

export const AuthButton: React.FC<AuthButtonProps> = ({ isModalOpen, onModalToggle }) => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

  const handleClick = () => {
    if (isAuthenticated) {
      dispatch(logout());
    } else {
      onModalToggle(true);
    }
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        {isAuthenticated ? <FaSignOutAlt /> : <FaUser />}
      </IconButton>
      <AuthModal
        isOpen={isModalOpen}
        onClose={() => onModalToggle(false)}
      />
    </>
  );
};