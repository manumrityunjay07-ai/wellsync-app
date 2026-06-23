const { GoogleGenerativeAI } = require('@google/generative-ai')

const apiKey = process.env.GEMINI_API_KEY
let model = null

if (apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey)
  model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' })
} else {
  console.warn('⚠️  GEMINI_API_KEY not set. AI features will be disabled.')
}

async function askGemini(prompt) {
  if (!model) throw new Error('Gemini API key not configured')
  try {
    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()
    const clean = text.replace(/```json|```/g, '').trim()
    return JSON.parse(clean)
  } catch (error) {
    console.error('Gemini JSON error:', error.message)
    throw new Error('AI request failed')
  }
}

async function askGeminiText(prompt) {
  if (!model) throw new Error('Gemini API key not configured')
  const result = await model.generateContent(prompt)
  return result.response.text().trim()
}

async function askGeminiVision(prompt, base64Image, mimeType) {
  if (!model) throw new Error('Gemini API key not configured')
  try {
    const imageParts = [
      {
        inlineData: {
          data: base64Image,
          mimeType: mimeType
        }
      }
    ]
    const result = await model.generateContent([prompt, ...imageParts])
    const text = result.response.text().trim()
    const clean = text.replace(/```json|```/g, '').trim()
    return JSON.parse(clean)
  } catch (error) {
    console.error('Gemini Vision JSON error:', error.message)
    throw new Error('AI vision request failed')
  }
}

module.exports = { askGemini, askGeminiText, askGeminiVision }
