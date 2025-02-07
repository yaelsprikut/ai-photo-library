import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'
import 'dotenv/config'
import {
  isVideoFile,
  isImageFile,
  tagImageFile,
  encodeImageToBase64,
  convertToJpeg,
} from './helpers.js'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const filePath = process.argv[2]

console.log('Is image: ', isImageFile(filePath) ? '✅' : '❌')
console.log('File Name: ', filePath)

const createPrompt = async base64Image => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Analyze this image and generate a concise list of visually descriptive tags to help identify 
                   the image. Include relevant adjectives, recognizable objects, text, landmarks, and themes.
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
  if (isVideoFile(filePath)) {
    console.log('❌ Skipping movie file...')
    process.exit(0)
  }
  let base64Image = null
  if (isImageFile(filePath)) {
    base64Image = encodeImageToBase64(`${filePath}`)
  } else {
    console.log('🔄 Use Converter')
    base64Image = await convertToJpeg(`${filePath}`)
  }
  const promptTags = await createPrompt(base64Image)
  tagImageFile(promptTags, filePath)
} catch (e) {
  console.log('error: ', e)
}
