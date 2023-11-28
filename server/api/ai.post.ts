import OpenAI from "openai";
import * as agents from "~/agents";

async function getAgentData(agent: string, body: Record<string, any>) {
  if (!Object.keys(agents).includes(agent)) {
    throw new Error(`${agent} doesn't exist`);
  }

  // @ts-expect-error chaking above that agent exists
  const agentResult = agents[agent](body);

  return {
    max_tokens: agentResult.max_tokens,
    temperature: agentResult.temperature,
    messages: agentResult.messages,
  };
}

function handleOpenAIError(error: any): void {
  if (error instanceof OpenAI.APIError) {
    console.error(
      `OpenAI API Error: ${error.status}, ${error.message}, ${error.code}, ${error.type}`
    );
  } else {
    console.error("Non-API error:", error);
  }
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { OPENAI_API_KEY } = useRuntimeConfig();
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    const agent = body.agent || "customerSupportAgent";
    const { max_tokens, temperature, messages } = await getAgentData(
      agent,
      body
    );

    const params: OpenAI.Chat.ChatCompletionCreateParams = {
      model: "gpt-3.5-turbo",
      max_tokens: max_tokens ?? 1000,
      temperature: temperature ?? 1,
      messages: messages ?? [],
    };

    console.log("Request parameters:", params.temperature);

    const chatCompletion: OpenAI.Chat.ChatCompletion =
      await openai.chat.completions.create(params);

    // TODO: tidy up
    console.log("Chat completion response:", chatCompletion.choices[0].message);

    return chatCompletion;
  } catch (error) {
    handleOpenAIError(error);
  }
});
