import OpenAI from "openai";

export default defineEventHandler((event) => {
  const { OPENAI_API_KEY } = useRuntimeConfig();

  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
  });

  async function main() {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: "You are a helpful assistant." }],
      model: "gpt-3.5-turbo",
    });

    // TODO: tidy up
    console.log(completion.choices[0]);

    return completion;
  }

  main();
});
