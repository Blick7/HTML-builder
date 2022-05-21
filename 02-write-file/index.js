const fs = require('fs');
const { stdout, stdin, exit } = require('process');
const path = require('path');
const dir = path.join(__dirname, '/notes.txt');

const outputStream = fs.createWriteStream(dir, { flags: 'a' });

stdout.write('Enter your message:\n');

stdin.on('data', (data) => {
  const dataStringified = data.toString();
  if (dataStringified.trim() === 'exit') exit();
  outputStream.write(dataStringified.trim());
});

process.on('exit', () => stdout.write('\nGoodbye!'));
process.on('SIGINT', () => exit());
