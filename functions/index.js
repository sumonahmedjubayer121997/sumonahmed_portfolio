
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const OpenAIService = require('./services/openai-service');
const { SYSTEM_PROMPT } = require('./config/prompts');

admin.initializeApp();

exports.aiChat = functions.https.onCall(async (data, context) => {
  try {
    const { message } = data;

    if (!message) {
      throw new functions.https.HttpsError('invalid-argument', 'Message is required');
    }

    const openaiService = new OpenAIService();
    
    const reply = await openaiService.createChatCompletion([
      SYSTEM_PROMPT,
      { role: 'user', content: message }
    ]);

    return { reply };
  } catch (error) {
    console.error('Error in AI chat function:', error);
    
    // Handle specific OpenAI API key configuration error
    if (error.message.includes('OpenAI API key not configured')) {
      throw new functions.https.HttpsError('failed-precondition', 'AI service not properly configured');
    }
    
    throw new functions.https.HttpsError('internal', 'Failed to process AI request');
  }
});
