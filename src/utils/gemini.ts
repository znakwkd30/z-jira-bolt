import {
  EnhancedGenerateContentResponse,
  GenerateContentResult,
  GenerativeModel,
  GoogleGenerativeAI,
} from '@google/generative-ai';

export class Gemini {
  private readonly ggAi: GoogleGenerativeAI;
  private readonly model: GenerativeModel;

  constructor() {
    this.ggAi = new GoogleGenerativeAI(process.env.GEMINI_AI_KEY);
    this.model = this.ggAi.getGenerativeModel({ model: 'gemini-pro' });
  }

  async run(context: string) {
    const result: GenerateContentResult = await this.model.generateContent(
      context,
    );
    const response: EnhancedGenerateContentResponse = result.response;

    return response.text();
  }
}
