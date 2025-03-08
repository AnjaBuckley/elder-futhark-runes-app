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

// Detailed descriptions of each rune's shape
const runeDescriptions = {
  "fehu": "resembles the letter F with two horizontal lines extending to the right from a vertical line",
  "uruz": "looks like a pointed arch or an upside-down U with the bottom ends extending outward",
  "thurisaz": "resembles a thorn or the number 4 without the horizontal line",
  "ansuz": "looks like an F with the top horizontal line angled upward",
  "raido": "resembles the letter R without the curved part, just a vertical line with a diagonal line extending from the middle",
  "kenaz": "looks like a less-than sign < or an angular C",
  "gebo": "resembles the letter X",
  "wunjo": "looks like the letter P rotated to the left, with a vertical line and an angular flag",
  "hagalaz": "resembles the letter H with the horizontal line slanted",
  "naudhiz": "looks like a slanted I with a diagonal line crossing it",
  "isaz": "a simple vertical line |",
  "jera": "resembles a mirrored C with another C, forming a year symbol",
  "eihwaz": "looks like a vertical line with two short diagonal lines in the middle pointing upward",
  "perthro": "resembles a modified P with an open top",
  "algiz": "looks like a Y with a straight stem",
  "sowilo": "resembles a lightning bolt or the letter S",
  "tiwaz": "resembles an arrow pointing upward ↑",
  "berkano": "resembles the letter B without the vertical line connecting the curves",
  "ehwaz": "looks like the letter M with vertical rather than diagonal lines",
  "mannaz": "resembles two vertical lines connected by diagonal lines forming an M shape",
  "laguz": "resembles the letter L with the vertical line extending below the horizontal",
  "ingwaz": "resembles a diamond ◊",
  "dagaz": "looks like an hourglass on its side or two triangles touching at their points",
  "othala": "resembles a diamond with two legs extending from the bottom corners"
};

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
    
    // Find the correct rune symbol
    const runeInfo = runesData.find(rune => rune.name.toLowerCase() === runeName.toLowerCase());
    const runeSymbol = runeInfo ? runeInfo.symbol : '?';
    
    // Create the image URL for the reference rune from GitHub
    const runeImageUrl = `https://raw.githubusercontent.com/AnjaBuckley/elder-futhark-runes-app/main/public/images/runes/${runeName.toLowerCase()}.png`;
    
    // Convert base64 data URL to a buffer if needed
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system", 
          content: `You are an encouraging teacher of Elder Futhark runes. Your task is to evaluate if a drawn image resembles the reference image of the specified rune.
                   Be lenient in your evaluation - consider it a match if the basic shape is recognizable, even with imperfections.
                   The correct symbol for the rune "${runeName}" is "${runeSymbol}".
                   Provide a score from 0-10 where:
                   - 4-10: The drawing is recognizable as the rune (consider this a success)
                   - 0-3: The drawing is not recognizable (consider this needing improvement)
                   Always start with positive feedback before suggesting improvements.
                   Always include the correct rune symbol (${runeSymbol}) in your response and explain its key features.`
        },
        {
          role: "user",
          content: [
            { type: "text", text: `Does this drawing resemble the Elder Futhark rune "${runeName}" (${runeSymbol})? Compare it with the reference image. Be encouraging and focus on similarities rather than minor differences. Start your response with either 'Yes, this drawing matches' or 'Not quite, but you're making progress' followed by your detailed feedback. Always include the correct rune symbol (${runeSymbol}) and describe its key features.` },
            { type: "image_url", image_url: { url: `data:image/png;base64,${base64Data}` } },
            { type: "text", text: "Here is the correct reference image of the rune:" },
            { type: "image_url", image_url: { url: runeImageUrl } }
          ]
        }
      ],
      max_tokens: 300
    });
    
    const feedback = response.choices[0].message.content;
    
    // More lenient success determination
    const success = feedback.toLowerCase().startsWith("yes, this drawing matches") || 
                   feedback.toLowerCase().includes("good job") ||
                   feedback.toLowerCase().includes("well done") ||
                   feedback.toLowerCase().includes("excellent") ||
                   (feedback.toLowerCase().includes("score") && 
                    /score.*?([4-9]|10)\/10/.test(feedback.toLowerCase()));
    
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