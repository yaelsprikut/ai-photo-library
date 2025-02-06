import OpenAI from "openai";
import fs from "fs";
import path from "path";
import "dotenv/config";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const encodeImageToBase64 = (imagePath) => {
    try {
        const absolutePath = path.resolve(imagePath);
        const imageBuffer = fs.readFileSync(absolutePath);
        const base64String = imageBuffer.toString('base64');
        return base64String;
    } catch (error) {
        console.error('Error reading image file:', error.message);
        process.exit(1);
    }
}

const base64Image = encodeImageToBase64('./background-yale.png');

const response = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: "Provide a list of tags that visually describe this image in json format" },
        {
          type: "image_url",
          image_url: {
            "url": `data:image/jpeg;base64,${base64Image}`
          },
        },
      ],
    },
  ],
  store: true,
});

console.log(response.choices[0]);
