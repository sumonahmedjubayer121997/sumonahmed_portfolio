
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/integrations/firebase/config';

interface ChatMessage {
  message: string;
}

interface ChatResponse {
  reply: string;
}

// Create a callable function reference
const aiChatFunction = httpsCallable<ChatMessage, ChatResponse>(functions, 'aiChat');

export const sendMessageToAI = async (message: string): Promise<string> => {
  try {
    const result = await aiChatFunction({ message });
    return result.data.reply;
  } catch (error) {
    console.error('Error calling AI chat function:', error);
    throw new Error('Failed to get AI response');
  }
};
