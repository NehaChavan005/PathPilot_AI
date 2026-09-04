import { apiClient } from './apiClient';

export const sendChatMessage = async (message, context = {}) => {
  try {
    const data = await apiClient('/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });

    return {
      sender: 'ai',
      text: data.reply,
      metricsUpdate: { accuracy: 88, communication: 90 }
    };
  } catch (error) {
    return {
      sender: 'ai',
      text: 'Sorry, I encountered an error processing your message. Please try again.',
      metricsUpdate: null
    };
  }
};
