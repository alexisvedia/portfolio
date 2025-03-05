import { useForm } from "react-hook-form";
import {
  FormContainer,
  FormGroup,
  Input,
  Label,
  SubmitButton,
  ErrorMessage,
} from "./ExampleForm.styles";

interface FormData {
  name: string;
  email: string;
  message: string;
}

export const ExampleForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <FormContainer onSubmit={handleSubmit(onSubmit)}>
      <FormGroup>
        <Label htmlFor="name">Nombre:</Label>
        <Input
          id="name"
          {...register("name", {
            required: "El nombre es requerido",
            minLength: {
              value: 2,
              message: "El nombre debe tener al menos 2 caracteres",
            },
          })}
        />
        {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="email">Email:</Label>
        <Input
          id="email"
          type="email"
          {...register("email", {
            required: "El email es requerido",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Email inválido",
            },
          })}
        />
        {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="message">Mensaje:</Label>
        <Input
          id="message"
          as="textarea"
          {...register("message", {
            required: "El mensaje es requerido",
            minLength: {
              value: 10,
              message: "El mensaje debe tener al menos 10 caracteres",
            },
          })}
        />
        {errors.message && (
          <ErrorMessage>{errors.message.message}</ErrorMessage>
        )}
      </FormGroup>

      <SubmitButton type="submit">Enviar</SubmitButton>
    </FormContainer>
  );
};
