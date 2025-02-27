import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import heicConvert from 'heic-convert'
import { execSync } from 'child_process'

export const isImageFile = filename => {
  return /\.(png|webp|gif|jpe?g)$/i.test(filename)
}

export const isVideoFile = filename => {
  // List of common video extensions
  const videoExtensions = [
    '.mp4',
    '.mkv',
    '.avi',
    '.mov',
    '.wmv',
    '.flv',
    '.webm',
    '.mpeg',
    '.mpg',
    '.3gp',
  ]

  // Get the file extension (case insensitive)
  const ext = path.extname(filename).toLowerCase()

  // Check if extension is in the list
  return videoExtensions.includes(ext)
}

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
export const convertToJpeg = async inputFilePath => {
  // List of common video extensions
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.heic']

  // Get the file extension (case insensitive)
  const ext = path.extname(inputFilePath).toLowerCase()

  // Check if extension is in the list
  if (!imageExtensions.includes(ext)) {
    console.log(`cannot convert ${ext} file`)
    process.exit(1)
  }
  try {
    const ext = path.extname(inputFilePath).toLowerCase()
    let inputBuffer = fs.readFileSync(inputFilePath)
    let processedBuffer

    if (ext === '.heic' || ext === '.heif') {
      console.log('📸 Converting HEIC to JPEG...')
      processedBuffer = await heicConvert({
        buffer: inputBuffer,
        format: 'JPEG',
        quality: 0.6,
      })
    } else {
      console.log(`🎨 Converting ${ext.toUpperCase()} to JPEG...`)
      processedBuffer = inputBuffer
    }

    // Convert the processed buffer to JPEG using sharp
    const jpegBuffer = await sharp(processedBuffer)
      .jpeg({ quality: 60, progressive: true })
      .resize(150)
      .toBuffer()

    console.log('✅ Conversion successful!')
    // Free memory (Prevent GC overhead)
    processedBuffer = Buffer.alloc(0)
    return jpegBuffer.toString('base64')
  } catch (error) {
    console.error('❌ Error converting image:', error)
  }
}

export const convertHeicToJpeg = async inputFilePath => {
  try {
    console.log(`### Run convertHeicToJpeg on ${inputFilePath}`)
    // const fileName = path.basename(inputFilePath, path.extname(inputFilePath)) // get name of file without .ext
    // Read HEIC file into memory
    const inputBuffer = fs.readFileSync(inputFilePath)

    // Convert HEIC to raw image buffer
    let rawImageBuffer = await heicConvert({
      buffer: inputBuffer,
      format: 'JPEG',
      quality: 0.5, // Quality range: 0 (worst) - 1 (best)
    })

    // Use sharp to process the image and output as a JPEG buffer
    let jpegBuffer = await sharp(rawImageBuffer)
      .jpeg({ quality: 70 }) // Adjust quality if needed
      .toBuffer()

    console.log('### HEIC converted to JPEG successfully!')
    const imageEncoded = jpegBuffer.toString('base64')
    // fs.writeFileSync(`${fileName}.jpg`, jpegBuffer)

    // Free raw image and JPEG buffer memory
    rawImageBuffer = null
    jpegBuffer = null

    global.gc && global.gc() // Force garbage collection (only works if Node.js is run with `--expose-gc`)

    return imageEncoded
  } catch (error) {
    console.error('Error converting HEIC to JPEG:', error)
  }
}

export const tagImageFile = (response, filePath) => {
  console.log(`🏷️ Associated tags: ${response.choices[0].message.content}`)
  execSync(`tag -a "${response.choices[0].message.content}" "${filePath}"`)
  console.log('✅ Image tagged!')
}

export const descImageFile = (response, filePath) => {
  console.log(`📝 Associated comment: ${response.choices[0].message.content}`)
  execSync(
    `exiftool -overwrite_original -Description="${response.choices[0].message.content}" ${filePath}`,
  )
  console.log('✅ Image description added!')
}
