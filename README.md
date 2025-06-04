# Mi Portfolio

Un portfolio moderno creado con React, TypeScript y Vite, con efectos acrílicos y animaciones avanzadas.

## Formulario de contacto

El formulario de contacto utiliza [EmailJS](https://www.emailjs.com/) para enviar mensajes sin necesidad de un backend.

✅ **Ya está configurado y funcional** con las siguientes características:

- Envío de correos electrónicos sin backend
- Cambio automático de plantilla según el idioma (español/inglés)
- Efecto acrílico y validación de campos
- Animaciones y mensajes de feedback

Para más detalles sobre la configuración, consulta la documentación en `src/docs/EmailJSSetup.md`.

## Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## Compilación

```bash
# Construir para producción
npm run build
```

## Backend en Python

El proyecto incluye un pequeño servidor en `backend/` implementado con Flask.
Proporciona registro, inicio de sesión y gestión de una lista de herramientas de inteligencia artificial.

Para instalar las dependencias del backend y ejecutarlo:

```bash
cd backend
pip install -r requirements.txt
python app.py
```

El servidor utiliza SQLite por defecto y crea una cuenta admin `admin`/`admin` la primera vez que se inicia.

### Variables de entorno

El backend lee las siguientes variables, que puedes definir en un archivo `.env` dentro de `backend/` o en tu entorno de shell:

| Variable            | Descripción                                       |
|---------------------|---------------------------------------------------|
| `JWT_SECRET_KEY`    | Clave secreta para firmar los tokens JWT          |
| `NLWEB_API_KEY`     | Credencial para acceder al servicio NLWeb de Microsoft |
| `NLWEB_ENDPOINT`    | (Opcional) URL del endpoint de NLWeb               |

Ejemplo de `.env`:

```dotenv
JWT_SECRET_KEY=mi-clave-super-secreta
NLWEB_API_KEY=tu_api_key_aqui
NLWEB_ENDPOINT=https://nlweb.microsoft.com/api/search
```
