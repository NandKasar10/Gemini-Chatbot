const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const { GoogleGenerativeAI } = require('@google/generative-ai');

const PORT = 8000;
const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.post("/gemini", async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chatHistory = req.body.history || [];

    // ✅ Format contents using Part format: { text: "..." }
    const contents = chatHistory.map((item) => ({
      role: item.role,
      parts: (Array.isArray(item.parts) ? item.parts : [item.parts]).map((part) => ({
        text: part
      }))
    }));

    contents.push({
      role: "user",
      parts: [{ text: req.body.message }]
    });

    const result = await model.generateContent({
      contents: contents
    });

    const response = await result.response;
    const text = await response.text();

    console.log("🧠 Gemini replied:", text);
    res.status(200).send(text);
  } catch (error) {
    console.error("❌ Gemini backend error:", error.message);
    res.status(500).send("Gemini backend error: " + error.message);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});