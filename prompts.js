const tagsPrompt = `Analyze this image and generate a concise list of visually descriptive tags to help identify 
                   the image. Include relevant adjectives, recognizable objects, text, landmarks, and themes.
                   Format the response strictly as a comma-separated list in the format: 'word, word, word' 
                   (e.g., 'sunset, beach, palmtrees, goldensky, oceanwaves'). Use only single-word tags.`

// const descPrompt = `Describe the photo's location, landmarks, and architectural or natural elements. 
//                     Include dominant colors, lighting, and style. Identify if it's landscape, portrait, 
//                     street, or abstract photography, noting composition and aesthetic details within 30 words.`
const descPrompt = "Describe the image in detail and under 100 words."

const prompt = { tagsPrompt, descPrompt }
export default prompt
