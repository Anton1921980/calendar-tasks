import React from "react";
import {
  ModalOverlay,
  ModalContent,
  ModalTitle,
  SubmitButton,
  SubmitContainer,
} from "./styles";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  onLoginClick,
}) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalTitle>Welcome to Calendar Tasks</ModalTitle>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <p>You are in DEMO mode</p>
          <span>EDIT, DELETE, Status Change is not working </span>          
          <p>Register to do it all with your own tasks</p>
        </div>
        <SubmitContainer>
          <SubmitButton onClick={onLoginClick}>Register</SubmitButton>
          <SubmitButton onClick={onClose}>continue DEMO</SubmitButton>
        </SubmitContainer>
      </ModalContent>
    </ModalOverlay>
  );
};
