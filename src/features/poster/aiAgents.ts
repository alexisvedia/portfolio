import { SiClaude, SiGooglegemini, SiOpenai } from 'react-icons/si';
import { INK } from './content';
import { DeepSeekIcon, GlmIcon, GrokIcon, QwenIcon } from './AiIcons';

/* Los siete agentes del sitio: color de cursor y etiqueta, y tinta para el texto encima. */
export const AI_AGENTS = [
  { id: 'claude', name: 'Claude', color: INK.red, ink: INK.cream, Icon: SiClaude },
  { id: 'gemini', name: 'Gemini', color: INK.blue, ink: INK.cream, Icon: SiGooglegemini },
  { id: 'openai', name: 'ChatGPT', color: INK.lime, ink: INK.ground, Icon: SiOpenai },
  { id: 'deepseek', name: 'DeepSeek', color: INK.teal, ink: INK.cream, Icon: DeepSeekIcon },
  { id: 'qwen', name: 'Qwen', color: INK.violet, ink: INK.cream, Icon: QwenIcon },
  { id: 'grok', name: 'Grok', color: INK.cream, ink: INK.ground, Icon: GrokIcon },
  { id: 'glm', name: 'GLM', color: INK.orange, ink: INK.ground, Icon: GlmIcon },
] as const;
