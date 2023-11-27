import OpenAI from "openai";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { OPENAI_API_KEY } = useRuntimeConfig();

  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
  });

  async function main() {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: body.messages || [],
      temperature: body.temperature || 1,
    });

    // TODO: tidy up
    console.log(completion.choices[0]);

    return completion;
  }

  main();
});
