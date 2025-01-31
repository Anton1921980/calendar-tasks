import styled from '@emotion/styled';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

export const ModalTitle = styled.h2`
  margin: 0 0 1.5rem;
  color: #333;
  text-align: center;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
  background-color: lightgray;

  &:focus {
    outline: none;
    border-color: #ff9800;
  }
`;
export const SubmitContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;
export const SubmitButton = styled.button`
  padding: 0.75rem;
  background-color: #ff9800;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f57c00;
  }
  &:focus { 
  outline: none;
  user-select: none;
`;

export const ToggleLink = styled.span`
  color: #ff9800;
  cursor: pointer;
  text-align: center;
  margin-top: 0.5rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

export const ErrorMessage = styled.div`
  color: #f44336;
  margin-bottom: 1rem;
  text-align: center;
  font-size: 0.9rem;
`;