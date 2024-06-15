import { openai } from "@ai-sdk/openai";
import { StreamingTextResponse, streamText } from "ai";
import OpenAI from "openai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = await streamText({
      model: openai("gpt-4-turbo"),
      messages,
    });

    return result.toAIStreamResponse();
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
        
    } else {
      console.error("An unexpected erroroccured", error);
      throw error;
    }
  }
}
