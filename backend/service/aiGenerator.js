const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const generateTestWithAI = async (promptText) => {
  const prompt = `
Tạo đề kiểm tra dưới dạng JSON chuẩn sau:

[
  {
    "question": "....",
    "options": ["...", "...", "...", "..."],
    "correctAnswer": "..."
  }
]

Yêu cầu: ${promptText}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  const raw = response.choices[0].message.content;

  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("⚠️ AI trả về không phải JSON:", raw);
    throw new Error("Lỗi phân tích JSON từ AI");
  }
};

module.exports = { generateTestWithAI };