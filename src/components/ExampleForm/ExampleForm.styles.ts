import styled from "styled-components";

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.lg};
  max-width: 500px;
  width: 100%;
  padding: ${({ theme }) => theme.space.xl};
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xs};
`;

export const Label = styled.label`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 500;
`;

export const Input = styled.input`
  padding: ${({ theme }) => theme.space.sm} ${({ theme }) => theme.space.md};
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.md};
  transition: all 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}33;
  }

  &[as="textarea"] {
    min-height: 100px;
    resize: vertical;
  }
`;

export const SubmitButton = styled.button`
  padding: ${({ theme }) => theme.space.md} ${({ theme }) => theme.space.xl};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: ${({ theme }) => theme.colors.accent};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ErrorMessage = styled.span`
  color: #ff4444;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-top: ${({ theme }) => theme.space.xs};
`;
