const express = require("express");
const app = express();
const { createCanvas, registerFont } = require('canvas')
registerFont('./NotoEmoji-Regular.ttf', {family: 'noto'})
registerFont('./JetBrainsMono-Regular.ttf', {family: 'jetBrains'})
const request = require('request')
const data = require ('unicode-emoji-json')

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/title", (request, response) => {
  response.setHeader('Content-Type', 'image/png;charset=UTF-8');
  const text = swapEmoji(request.query.text)
  const canvas = drawTitle(text);
  const stream = canvas.createPNGStream();
  stream.pipe(response)
});

app.get("/note", (request, response) => {
  response.setHeader('Content-Type', 'image/png;charset=UTF-8');
  const text = swapEmoji(request.query.text)
  const canvas = drawNote(text, request.query.date);
  const stream = canvas.createPNGStream();
  stream.pipe(response)
});

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

function drawTitle(string) {
  const PADDING = 100
  const [canvas, ctx] = createBase()
  ctx.font = `70px 'jetBrains, noto'`
  ctx.fillText(string, PADDING, PADDING * 1.5)

  ctx.font = '40px jetBrains, noto'
  ctx.fillText('@ muan.co', PADDING, HEIGHT - PADDING)
  return canvas
}

function drawNote(string, date = '') {
  const PADDING = 100
  const MAX = 35
  const MAXLINES = 5
  const [canvas, ctx] = createBase()
  ctx.font = `50px 'jetBrains, noto'`

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

  ctx.font = '40px jetBrains'
  ctx.fillText(`${date ? date + ' ' : ''}@ muan.co`, PADDING, HEIGHT - PADDING)
  return canvas
}

function swapEmoji(str) {
  return str.trim().split(/(:[^:]+:)/).map(text => {
    const [_1, emojiName] = text.match(/^:(\w+):$/) || []
    const emoji = emojiName ? Object.keys(data).find(e => data[e].name === emojiName) || text : null
    return emoji || text
  }).join('')
}

// listen for requests :)
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
