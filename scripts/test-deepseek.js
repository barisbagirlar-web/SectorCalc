const { OpenAI } = require('openai');
require('dotenv').config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1',
});

async function test() {
  try {
    const res = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: 'Ping! Cevap ver: Pong' }],
      max_tokens: 10
    });
    console.log("Success:", res.choices[0].message.content);
  } catch (err) {
    console.error("Error:", err.message);
  }
}
test();
