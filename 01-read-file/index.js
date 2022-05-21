const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '/text.txt');
const readableStream = fs.createReadStream(dir);

let data = '';
readableStream.on('data', (chunk) => (data += chunk));
readableStream.on('end', () => console.log(data));
