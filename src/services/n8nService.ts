const N8N_WEBHOOK_URL = import.meta.env.DEV
  ? 'http://localhost:5678/webhook/49a82584-2afa-4ebf-b83a-93b5348cfe98/chat'
  : import.meta.env.VITE_N8N_WEBHOOK_URL;
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

const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

let currentSessionId = generateSessionId();

const fetchWithRetry = async (
  url: string,
  options: RequestInit,
  maxRetries = 5
): Promise<Response> => {
  let retries = 0;
  let lastError: Error | null = null;
  const waitTime = 2000;

  while (retries < maxRetries) {
    try {
      const response = await fetch(url, options);

      if (
        response.status === 500 ||
        response.status === 503 ||
        response.status === 502 ||
        response.status === 504
      ) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
        retries++;
        continue;
      }

      return response;
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.includes('failed to fetch') ||
          error.message.includes('network') ||
          error.message.includes('connection'))
      ) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
        retries++;
        lastError = error;
        continue;
      }

      throw error;
    }
  }

  throw lastError || new Error(`Error de conexión después de ${maxRetries} intentos`);
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
