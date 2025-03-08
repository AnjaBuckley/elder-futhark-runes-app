const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve your static files

// Configure OpenAI with v4 syntax
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Simplified runes data for reference
const runesData = [
  { name: "Fehu", symbol: "ᚠ" },
  { name: "Uruz", symbol: "ᚢ" },
  { name: "Thurisaz", symbol: "ᚦ" },
  { name: "Ansuz", symbol: "ᚨ" },
  { name: "Raido", symbol: "ᚱ" },
  { name: "Kenaz", symbol: "ᚲ" },
  { name: "Gebo", symbol: "ᚷ" },
  { name: "Wunjo", symbol: "ᚹ" },
  { name: "Hagalaz", symbol: "ᚺ" },
  { name: "Naudhiz", symbol: "ᚾ" },
  { name: "Isaz", symbol: "ᛁ" },
  { name: "Jera", symbol: "ᛃ" },
  { name: "Eihwaz", symbol: "ᛇ" },
  { name: "Perthro", symbol: "ᛈ" },
  { name: "Algiz", symbol: "ᛉ" },
  { name: "Sowilo", symbol: "ᛊ" },
  { name: "Tiwaz", symbol: "ᛏ" },
  { name: "Berkano", symbol: "ᛒ" },
  { name: "Ehwaz", symbol: "ᛖ" },
  { name: "Mannaz", symbol: "ᛗ" },
  { name: "Laguz", symbol: "ᛚ" },
  { name: "Ingwaz", symbol: "ᛜ" },
  { name: "Dagaz", symbol: "ᛞ" },
  { name: "Othala", symbol: "ᛟ" }
];

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {role: "system", content: "You are a knowledgeable expert on Elder Futhark runes. Provide accurate, concise information about their history, meanings, and usage."},
        {role: "user", content: message}
      ],
    });
    
    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error with OpenAI API:', error);
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
});

app.post('/api/evaluate-drawing', async (req, res) => {
  try {
    const { imageData, runeName } = req.body;
    
    // Find the correct rune symbol from runesData
    const runeInfo = runesData.find(rune => rune.name.toLowerCase() === runeName.toLowerCase());
    const runeSymbol = runeInfo ? runeInfo.symbol : '?';
    
    // Convert base64 data URL to a buffer if needed
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system", 
          content: `You are an expert in Elder Futhark runes. Your task is to evaluate if a drawn image matches the specified rune. 
                   Be strict in your evaluation - only consider it a match if the core shape and structure are correct. 
                   The correct symbol for the rune "${runeName}" is "${runeSymbol}". 
                   Provide a score from 0-10 where 0 is completely wrong and 10 is perfect.`
        },
        {
          role: "user",
          content: [
            { type: "text", text: `Does this drawing match the Elder Futhark rune "${runeName}" (${runeSymbol})? Be critical and accurate in your assessment. Start your response with either 'Yes, this drawing matches' or 'No, this drawing does not match' followed by your detailed feedback.` },
            { type: "image_url", image_url: { url: `data:image/png;base64,${base64Data}` } }
          ]
        }
      ],
      max_tokens: 300
    });
    
    const feedback = response.choices[0].message.content;
    
    // More precise success determination
    const success = feedback.toLowerCase().startsWith("yes, this drawing matches");
    
    res.json({ 
      success, 
      message: feedback 
    });
  } catch (error) {
    console.error('Error with drawing evaluation:', error);
    res.status(500).json({ error: 'Failed to evaluate drawing' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 