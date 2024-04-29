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
        `\nJira 이슈 생성을 위해 위에 내용을 요약해서 summary 와 description 추출해줘.\nsummary 와 description 이 내용을 해석 하는데 필요한 관련 모든 컨텍스트를 포함하는지 확인하고 중요한 컨텍스트가 누락된 작은 스니펫을 추출하지 말고 출력은 다음과 같은 JSON format 으로 출력해줘: \n{"summary": "한글", "description": "한글"}`,
    );
    const response: EnhancedGenerateContentResponse = result.response;

    return response.text();
  }
}
