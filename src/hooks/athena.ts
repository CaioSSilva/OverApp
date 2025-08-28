import { GenerateContentResponse, GoogleGenAI } from '@google/genai';
import { defaultPayload } from './athenaAct';

const athena = new GoogleGenAI({
  apiKey: 'AIzaSyDhS8-CVMB7Sfs6_vXe4E9xZmaVcLbc6yA',
});

const askAthena = async (question: string): Promise<string | undefined> => {
  const response = await athena.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: { text: defaultPayload + question },
  });
  return extractAthenaText(response);
};

export function AthenaService() {
  return {
    askAthena,
  };
}

function extractAthenaText(
  response: GenerateContentResponse | undefined,
): string | undefined {
  return response?.candidates?.[0]?.content?.parts?.[0]?.text;
}
