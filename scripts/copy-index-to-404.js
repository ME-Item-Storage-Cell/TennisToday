import { copyFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const distDir = resolve(__dirname, '..', 'dist')

await copyFile(resolve(distDir, 'index.html'), resolve(distDir, '404.html'))
console.log('Copied dist/index.html to dist/404.html')
