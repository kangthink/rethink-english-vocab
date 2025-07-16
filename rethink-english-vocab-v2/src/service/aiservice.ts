import OpenAI from 'openai';

export interface AIService {
  run(input: string, prompt: string): Promise<string>;
  changeModel(name: string): void;
}

export class OpenAIService implements AIService {
  private client: OpenAI;
  private model: string = 'gpt-4.1-mini';

  constructor(apiKey: string) {
    this.client = new OpenAI({
      apiKey: apiKey,
    });
  }

  async run(input: string, prompt: string): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: prompt,
          },
          {
            role: 'user',
            content: input,
          },
        ],
        temperature: 0.7,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to process AI request');
    }
  }

  changeModel(name: string): void {
    this.model = name;
  }

  getCurrentModel(): string {
    return this.model;
  }
}

export class MockAIService implements AIService {
  private model: string = 'mock-model';

  async run(input: string, prompt: string): Promise<string> {
    return `Mock response for input: "${input}" with prompt: "${prompt}"`;
  }

  changeModel(name: string): void {
    this.model = name;
  }

  getCurrentModel(): string {
    return this.model;
  }
}