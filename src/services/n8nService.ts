// Service to handle n8n chat webhook communication

const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;

export interface ChatMessage {
  text: string;
  isUser: boolean;
}

interface N8NResponse {
  output?: string;
  error?: string;
  status?: number;
  data?: any;
}

// Generate a unique session ID for the chat
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Store the session ID for reuse
let currentSessionId = generateSessionId();

// Función para implementar reintentos con backoff exponencial
const fetchWithRetry = async (url: string, options: RequestInit, maxRetries = 3): Promise<Response> => {
  let retries = 0;
  let lastError: Error | null = null;

  while (retries < maxRetries) {
    try {
      const response = await fetch(url, options);
      
      // Si el servicio está iniciando (503) o hay un error de conexión, reintentamos
      if (response.status === 503 || response.status === 502 || response.status === 504) {
        // Calculamos el tiempo de espera con backoff exponencial (1s, 2s, 4s)
        const waitTime = Math.pow(2, retries) * 1000;
        await new Promise(resolve => setTimeout(resolve, waitTime));
        retries++;
        continue;
      }
      
      return response;
    } catch (error) {
      // Si es un error de red (failed to fetch), reintentamos
      if (error instanceof Error && 
          (error.message.includes('failed to fetch') || 
           error.message.includes('network') || 
           error.message.includes('connection'))) {
        const waitTime = Math.pow(2, retries) * 1000;
        await new Promise(resolve => setTimeout(resolve, waitTime));
        retries++;
        lastError = error;
        continue;
      }
      
      // Para otros tipos de errores, los propagamos
      throw error;
    }
  }
  
  // Si llegamos aquí, es porque agotamos los reintentos
  throw lastError || new Error('Error de conexión después de varios intentos');
};

export const sendMessageToN8N = async (message: string): Promise<ChatMessage> => {
  try {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        chatInput: message,
        sessionId: currentSessionId,
        type: 'chat_message',
      }),
    };
    
    // Usamos nuestra función con reintentos
    const response = await fetchWithRetry(N8N_WEBHOOK_URL, options);

    if (!response.ok) {
      const errorData: N8NResponse = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Error en la comunicación con el servicio: ${response.status}`
      );
    }

    const data: N8NResponse = await response.json();

    if (!data.output) {
      throw new Error('Respuesta inválida del servicio');
    }

    return {
      text: data.output,
      isUser: false,
    };
  } catch (error) {
    console.error('Error en la comunicación con n8n:', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo más tarde.';

    return {
      text: errorMessage,
      isUser: false,
    };
  }
};
