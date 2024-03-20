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
      context +
        `Your task is to extract document summaries and descriptions for Jira issue tickets.\n Ensure that summaries and descriptions contain all relevant context needed to interpret them - in other words don't extract small snippets that are missing important context. Provide output in JSON format as follows: \n {"summary": "한글", "description": "한글"}\n Provide summary and description value in Korean.`,
    );
    const response: EnhancedGenerateContentResponse = result.response;

    return response.text();
  }
}
