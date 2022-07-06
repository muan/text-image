const express = require("express")
const app = express()
const { loadImage, createCanvas, registerFont } = require('canvas')
registerFont('./ReadexPro-SemiBold.ttf', {family: 'readex', weight: 'bold'})
registerFont('./ReadexPro-Medium.ttf', {family: 'readex'})

app.get("/", (_, response) => {
  response.sendFile(__dirname + "/views/index.html")
})

app.get("/title", async (request, response) => {
  response.setHeader('Content-Type', 'image/pngcharset=UTF-8')
  const text = request.query.text
  const canvas = await drawTitle(text, request.query.size || 100)
  const stream = canvas.createPNGStream()
  stream.pipe(response)
})

app.get("/note", (request, response) => {
  response.setHeader('Content-Type', 'image/pngcharset=UTF-8')
  const text = request.query.text
  const canvas = drawNote(text, request.query.date)
  const stream = canvas.createPNGStream()
  stream.pipe(response)
})

const WIDTH = 1200
const HEIGHT = 630

function createBase() {
  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext('2d')
  ctx.rect(0, 0, WIDTH, HEIGHT)
  ctx.fillStyle = '#f9f9f9'
  ctx.fill()
  ctx.fillStyle = '#454545'
  return [canvas, ctx]
}

async function drawTitle(string, size) {
  const PADDING = 100
  const [canvas, ctx] = createBase()
  ctx.fillStyle = '#767676'
  ctx.font = `40px readex`
  ctx.fillText('muan.co', PADDING, PADDING * 1.5)

  ctx.fillStyle = '#222222'
  ctx.font = `normal 600 ${size}px readex`
  ctx.fillText(string, PADDING - size / 25, PADDING + 20 + size * 1.4)

  const logoWidth = 100 * 0.8
  const logoHeight = 86 * 0.8
  const image = await loadImage('./logo.png')
  ctx.drawImage(image, PADDING, HEIGHT - PADDING - logoHeight, logoWidth, logoHeight)
  return canvas
}


function drawNote(string, date = '') {
  const PADDING = 100
  const MAX = 35
  const MAXLINES = 5
  const [canvas, ctx] = createBase()
  ctx.font = `50px readex`

  let wrappedString = ''
  let currentLine = ''
  let lines = 1
  for (const word of string.split(' ')) {
    if (currentLine.length + word.length > MAX) {
      wrappedString += `\n${word}`
      currentLine = word
      lines += 1
    } else {
      currentLine += ` ${word}`
      wrappedString += ` ${word}`
    }

    if (lines === MAXLINES) {
      wrappedString += '...'
      break
    }
  }
  
  ctx.fillText(wrappedString.trim(), PADDING, PADDING * 1.5)

  ctx.font = '40px readex'
  ctx.fillText(`${date ? date + ' ' : ''}@ muan.co`, PADDING, HEIGHT - PADDING)
  return canvas
}

// listen for requests :)
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port)
})
