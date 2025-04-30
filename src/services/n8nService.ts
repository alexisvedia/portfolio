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

// Variable para rastrear si el servidor ya ha sido inicializado y la promesa de inicialización
let serverInitialized = false;
let initializationPromise: Promise<boolean> | null = null;

const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

let currentSessionId = generateSessionId();

const fetchWithRetry = async (
  url: string,
  options: RequestInit,
  maxRetries = 3
): Promise<Response> => {
  let retries = 0;
  let lastError: Error | null = null;
  const waitTime = 1500;

  // Verificar si estamos en móvil para ajustar estrategia
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const actualMaxRetries = isMobile ? 2 : maxRetries; // Menos reintentos en móvil

  while (retries < actualMaxRetries) {
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

  throw lastError || new Error(`Error de conexión después de ${actualMaxRetries} intentos`);
};

/**
 * Inicializa el servidor n8n enviando una petición de precalentamiento
 * Esta función debe ser llamada cuando se carga la aplicación
 */
export const initializeN8NServer = async (): Promise<boolean> => {
  // Si ya se ha inicializado, retornamos true inmediatamente
  if (serverInitialized) return true;
  
  // Si ya hay una inicialización en curso, retornamos la promesa existente
  if (initializationPromise) return initializationPromise;
  
  // Verificar si estamos en un dispositivo de baja potencia (priorizar rendimiento)
  const isLowPowerDevice = typeof navigator !== 'undefined' && 
                           navigator.hardwareConcurrency !== undefined && 
                           navigator.hardwareConcurrency <= 4;

  // Crear una nueva promesa de inicialización
  initializationPromise = (async () => {
    // Retrasamos un poco la inicialización en dispositivos móviles o de baja potencia
    if (isLowPowerDevice || (typeof window !== 'undefined' && window.innerWidth <= 768)) {
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          chatInput: 'ping',
          sessionId: currentSessionId,
          type: 'warmup',
        }),
      };

      // Usamos un timeout más corto para la inicialización
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000); // Reducir el timeout
      
      try {
        const response = await fetch(N8N_WEBHOOK_URL, {
          ...options,
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        if (response.ok) {
          serverInitialized = true;
          initializationPromise = null;
          return true;
        }
      } catch (error) {
        clearTimeout(timeoutId);
      }
      
      initializationPromise = null;
      return false;
    } catch (error) {
      console.error('Error al inicializar el servidor n8n:', error);
      initializationPromise = null;
      return false;
    }
  })();

  return initializationPromise;
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
    // Mantenemos el log de error para depuración pero lo hacemos más discreto
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
