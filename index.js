const express = require("express");
const app = express();
const { createCanvas, registerFont } = require('canvas')
registerFont('./NotoEmoji-Regular.ttf', {family: 'noto'})
registerFont('./JetBrainsMono-Regular.ttf', {family: 'jetBrains'})
const request = require('request')

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/image", (request, response) => {
  response.setHeader('Content-Type', 'image/png');
  //   if (!request.query.url) {
  //     response.sendFile(__dirname + "/views/index.html");
  //     return
  //   }

  //   const url = new URL(request.query.url)
  //   if (url.hostname !== 'muan.co') {
  //     response.sendFile(__dirname + "/views/index.html");
  //     return
  //   }

  //   request(request.query.url, (err, res, body) => {
  //     if (err) { return console.log(err); }
  //     console.log(body.url);
  //     console.log(body);
  //   });

  const canvas = drawImage(request.query.text);
  const stream = canvas.createPNGStream();
  stream.pipe(response)
});

const PADDING = 100
const WIDTH = 900
const HEIGHT = 400
const FONT = 50

function drawImage(string) {
  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext('2d')
  ctx.rect(0, 0, WIDTH, HEIGHT)
  ctx.fillStyle = '#f9f9f9'
  ctx.fill()
  ctx.fillStyle = '#454545'

  ctx.font = `${FONT}px 'noto, jetBrains'`
  const lines = string.match(/\n/g) ? string.match(/\n/g).length : 1
  ctx.fillText(string, PADDING, 150)

  ctx.font = '30px monospace'
  ctx.fillText('@ muan.co', PADDING, HEIGHT - PADDING)
  return canvas
}

// listen for requests :)
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
