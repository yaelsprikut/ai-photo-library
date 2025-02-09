import OpenAI from 'openai'
import 'dotenv/config'
import {
  isVideoFile,
  isImageFile,
  tagImageFile,
  descImageFile,
  encodeImageToBase64,
  convertToJpeg,
} from './helpers.js'
import prompt from './prompts.js'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const filePath = process.argv[2]

console.log('Is image: ', isImageFile(filePath) ? '✅' : '❌')
console.log('File Name: ', filePath)
console.log('tagsPrompt: ', prompt.tagsPrompt)

const createPrompt = async base64Image => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: prompt.descPrompt,
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
  // tagImageFile(promptTags, filePath)
  descImageFile(promptTags, filePath)
} catch (e) {
  console.log('error: ', e)
}
