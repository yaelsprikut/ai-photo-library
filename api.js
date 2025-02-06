import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'
import 'dotenv/config'
import {
  isImageFile,
  tagImageFile,
  encodeImageToBase64,
  convertToJpeg,
} from './helpers.js'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const filePath = process.argv[2]
console.log('Valid IMG .extension: ', isImageFile(filePath))

const createPrompt = async base64Image => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Analyze this image and generate a concise list of visually descriptive tags. 
                   Include relevant adjectives, recognizable objects, text, landmarks, and themes.
                   Format the response strictly as a comma-separated list in the format: 'word, word, word' 
                   (e.g., 'sunset, beach, palmtrees, goldensky, oceanwaves'). Use only single-word tags.`,
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`,
            },
          },
        ],
      },
    ],
    store: true,
  })
  return response
}

try {
  if (isImageFile(filePath)) {
    const base64Image = encodeImageToBase64(`${filePath}`)
    const promptTags = await createPrompt(base64Image)
    tagImageFile(promptTags, filePath)
  } else {
    console.log('use converter')
    const base64Image = await convertToJpeg(filePath)
    const promptTags = await createPrompt(base64Image)
    tagImageFile(promptTags, filePath)
  }
} catch (e) {
  console.log('error: ', e)
}
