import OpenAI from "openai";
import fs from "fs";
import path from "path";
import "dotenv/config";
import { execSync } from "child_process";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const encodeImageToBase64 = (imagePath) => {
  try {
    const absolutePath = path.resolve(imagePath);
    const imageBuffer = fs.readFileSync(absolutePath);
    const base64String = imageBuffer.toString("base64");
    return base64String;
  } catch (error) {
    console.error("Error reading image file:", error.message);
    process.exit(1);
  }
};

const filePath = process.argv[2];

const base64Image = encodeImageToBase64(`${filePath}`);

const response = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Provide a list of tags that visually describe this image in a string list of comma separated descriptivee adjectives in 'word, word, word' format",
        },
        {
          type: "image_url",
          image_url: {
            url: `data:image/jpeg;base64,${base64Image}`,
          },
        },
      ],
    },
  ],
  store: true,
});

process.env.TAGS = response.choices[0].message.content;
execSync("echo $TAGS", { stdio: "inherit", env: process.env });
console.log(response.choices[0].message.content);

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
