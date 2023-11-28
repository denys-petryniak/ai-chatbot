import OpenAI from "openai";
import { customerSupportAgent } from "~/agents";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { OPENAI_API_KEY } = useRuntimeConfig();

    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });

    const params: OpenAI.Chat.ChatCompletionCreateParams = {
      model: "gpt-3.5-turbo",
      max_tokens: customerSupportAgent(body).max_tokens ?? 1000,
      temperature: customerSupportAgent(body).temperature ?? 1,
      messages: customerSupportAgent(body).messages ?? [],
    };

    console.log("params", params.temperature);

    const chatCompletion: OpenAI.Chat.ChatCompletion =
      await openai.chat.completions.create(params);

    // TODO: tidy up
    console.log(chatCompletion.choices[0].message);

    return chatCompletion;
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error(error.status); // e.g. 401
      console.error(error.message); // e.g. The authentication token you passed was invalid...
      console.error(error.code); // e.g. 'invalid_api_key'
      console.error(error.type); // e.g. 'invalid_request_error'
    } else {
      // Non-API error
      console.log(error);
    }
  }
});
