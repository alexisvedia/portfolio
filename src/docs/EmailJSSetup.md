# Configuración de EmailJS para el Formulario de Contacto

Este proyecto utiliza [EmailJS](https://www.emailjs.com/) para enviar correos electrónicos desde el formulario de contacto sin necesidad de un backend propio.

## Configuración actual

El formulario de contacto ya está configurado con las siguientes credenciales:

- **Service ID**: `service_srdurzn`
- **Public Key**: `CoI3CL1-8DQHvdStw`
- **Plantillas**:
  - `template_es` (para español)
  - `template_en` (para inglés)

El sistema selecciona automáticamente la plantilla adecuada según el idioma configurado en la aplicación.

## Estructura de datos enviada

Cuando se envía el formulario, se envían los siguientes datos a EmailJS:

```json
{
  "name": "Nombre del usuario",
  "title": "Asunto del mensaje",
  "email": "correo@ejemplo.com",
  "message": "Mensaje del usuario"
}
```

## Campos del formulario

El formulario incluye los siguientes campos:

1. **Nombre**: Nombre de la persona que contacta
2. **Asunto**: Asunto o título del mensaje
3. **Email**: Correo electrónico para responder
4. **Mensaje**: Contenido detallado del mensaje

## Mantenimiento y cambios

Si necesitas modificar la configuración de EmailJS:

1. Accede al componente `src/components/ContactSection/ContactSection.tsx`
2. Busca la función `handleSubmit`
3. Modifica las variables `serviceId`, `templateId` o `publicKey` según sea necesario
4. Si necesitas agregar o modificar campos, actualiza el objeto `templateParams`

## Verificación

Para comprobar que todo funciona correctamente:

1. Abre el formulario de contacto
2. Envía un mensaje de prueba
3. Deberías recibir el correo en la dirección configurada en tu servicio de EmailJS

## Solución de problemas

Si el formulario no funciona:

- Verifica que las credenciales en el código sean correctas
- Asegúrate de que las plantillas `template_es` y `template_en` existan en tu cuenta de EmailJS
- Comprueba que los nombres de los campos (`name`, `email`, `message`, `title`) coincidan con los esperados en tus plantillas
- Revisa la consola del navegador para ver posibles errores
- Verifica que el límite de mensajes gratuitos no se haya excedido (200/mes en el plan gratuito)
