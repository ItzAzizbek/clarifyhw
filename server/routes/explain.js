const express = require('express');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const systemPrompt = "You are a homework explainer for parents. Analyze this homework problem and return ONLY a valid JSON object — no markdown, no backticks, no explanation outside the JSON. The JSON must follow this exact structure: { subject, type, question, answer, steps: [ { title, explanation, how_to_say_it } ] }. Write all explanations at a parent level — simple, warm, and encouraging. Keep the response concise and practical. Use 2 to 4 steps for simple problems and only add more if truly necessary. Each explanation should be short, clear, and avoid repeating the title. Each how_to_say_it field should be a brief natural script the parent can read aloud in 1 to 3 sentences. Avoid repeating the same idea across multiple steps. Use a specific but short subject and type, such as Mathematics and Order of Operations.";

function stripMarkdownFences(value) {
  return value
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

function parseGeminiJson(rawText) {
  const cleanedText = stripMarkdownFences(rawText);
  return JSON.parse(cleanedText);
}

function buildPromptParts(text, image) {
  const promptText = text
    ? `Homework problem: ${text}`
    : 'Analyze the attached homework image and identify the full problem before explaining it.';

  const parts = [systemPrompt, promptText];

  if (image) {
    parts.push({
      inlineData: {
        data: image.buffer.toString('base64'),
        mimeType: image.mimetype,
      },
    });
  }

  return parts;
}

router.post('/', upload.single('image'), async (req, res) => {
  const text = req.body?.text?.trim();
  const image = req.file;

  if (!text && !image) {
    return res.status(400).json({
      message: 'Please provide either an image or text to explain.',
    });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      message: 'Gemini API key is not configured.',
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(buildPromptParts(text, image));
    const response = await result.response;
    const rawText = response.text();
    const parsed = parseGeminiJson(rawText);

    return res.json(parsed);
  } catch (error) {
    console.error('Gemini explain error:', error);

    return res.status(500).json({
      message: 'Failed to generate homework explanation.',
    });
  }
});

module.exports = router;
