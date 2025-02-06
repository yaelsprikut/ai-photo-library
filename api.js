import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'
import 'dotenv/config'
import { execSync } from 'child_process'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const encodeImageToBase64 = imagePath => {
  try {
    const absolutePath = path.resolve(imagePath)
    const imageBuffer = fs.readFileSync(absolutePath)
    const base64String = imageBuffer.toString('base64')
    return base64String
  } catch (error) {
    console.error('Error reading image file:', error.message)
    process.exit(1)
  }
}

const filePath = process.argv[2]
// const filePath = './images/elia.png';

const base64Image = encodeImageToBase64(`${filePath}`)

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

console.log(response.choices[0].message.content)
console.log(`Associated tags: ${response.choices[0].message.content}\n\n`)
execSync(`tag -a "${response.choices[0].message.content}" ${filePath}`);
console.log('Image tagged! ');

// execSync(`export TAGS=${response.choices[0].message.content}`,{ stdio: "inherit" }, (error, stdout, stderr) => {
//     if (error) {
//         console.error(`❌ Error: ${error.message}`);
//         return;
//     }
//     if (stderr) {
//         console.error(`⚠️ Stderr: ${stderr}`);
//         return;
//     }
//     console.log("Bash Output:\n", stdout);
// });
