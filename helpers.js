import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import heicConvert from 'heic-convert'

export const encodeImageToBase64 = imagePath => {
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

export async function convertHeicToJpeg(inputFilePath) {
  try {
    const fileName = path.basename(inputFilePath, path.extname(inputFilePath))
    console.log('fileName: ', fileName)
    // Read HEIC file into memory
    const inputBuffer = fs.readFileSync(inputFilePath)

    // Convert HEIC to raw image buffer
    let rawImageBuffer = await heicConvert({
      buffer: inputBuffer,
      format: 'JPEG',
      quality: 1, // Quality range: 0 (worst) - 1 (best)
    })

    // Use sharp to process the image and output as a JPEG buffer
    let jpegBuffer = await sharp(rawImageBuffer)
      .jpeg({ quality: 100 }) // Adjust quality if needed
      .toBuffer()

    console.log('HEIC converted to JPEG successfully!')

    // (Optional) Save to disk for verification
    fs.writeFileSync(`${fileName}.jpg`, jpegBuffer)

    // Free raw image and JPEG buffer memory
    rawImageBuffer = null
    jpegBuffer = null

    global.gc && global.gc() // Force garbage collection (only works if Node.js is run with `--expose-gc`)

    return jpegBuffer // JPEG buffer in memory
  } catch (error) {
    console.error('Error converting HEIC to JPEG:', error)
  }
}
