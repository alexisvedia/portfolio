import React from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

interface FormData {
  name: string;
  email: string;
  message: string;
}

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 500px;
`;

const ExampleForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    // Aquí puedes manejar el envío del formulario
    // Por ejemplo, enviar los datos a una API
  };

  return (
    <FormContainer onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name', { required: true })} placeholder="Nombre" />
      {errors.name && <span>Este campo es requerido</span>}
      
      <input {...register('email', { required: true, pattern: /^\S+@\S+$/i })} placeholder="Email" />
      {errors.email && <span>Por favor ingresa un email válido</span>}
      
      <textarea {...register('message', { required: true })} placeholder="Mensaje" />
      {errors.message && <span>Este campo es requerido</span>}
      
      <button type="submit">Enviar</button>
    </FormContainer>
  );
};

export default ExampleForm;
