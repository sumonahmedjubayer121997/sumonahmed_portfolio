
const { Configuration, OpenAIApi } = require('openai');
const functions = require('firebase-functions');

class OpenAIService {
  constructor() {
    // Get API key from Firebase Functions config
    const apiKey = functions.config().openai?.api_key;
    
    if (!apiKey) {
      throw new Error('OpenAI API key not configured. Please set it using Firebase CLI.');
    }

    const configuration = new Configuration({
      apiKey: apiKey,
    });
    
    this.openai = new OpenAIApi(configuration);
  }

  async createChatCompletion(messages, options = {}) {
    const defaultOptions = {
      model: 'gpt-3.5-turbo',
      max_tokens: 500,
      temperature: 0.7,
    };

    const completion = await this.openai.createChatCompletion({
      ...defaultOptions,
      ...options,
      messages,
    });

    return completion.data.choices[0]?.message?.content || 'Sorry, I could not process that request.';
  }
}

module.exports = OpenAIService;
