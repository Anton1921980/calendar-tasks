import React from 'react';
import { SpinnerContainer, Spinner } from './styles';

export const LoadingSpinner: React.FC = () => {
  return (
    <SpinnerContainer>
      <Spinner />
    </SpinnerContainer>
  );
};