// Mock API for the AI Roleplay Simulator
export const sendChatMessage = async (message, context = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simple mock logic for demonstration
      let responseText = "That's an interesting point. Could you elaborate on how you would implement that in Python using scikit-learn?";
      
      if (message.toLowerCase().includes("supervised")) {
        responseText = "Great! You correctly identified that supervised learning uses labeled data. What is the main difference between regression and classification within supervised learning?";
      }

      resolve({
        sender: 'ai',
        text: responseText,
        metricsUpdate: { accuracy: 88, communication: 90 }
      });
    }, 1200); // 1.2 second delay to simulate AI processing time
  });
};
