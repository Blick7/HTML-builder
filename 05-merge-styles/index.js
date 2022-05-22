const fsp = require('fs/promises');
const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, './styles');
const bundlePath = path.join(__dirname, '/project-dist/bundle.css');

const bundleStyles = async (dir) => {
  const files = await fsp.readdir(dir, { withFileTypes: true });
  const writeableStream = fs.createWriteStream(bundlePath);
  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.join(dir, file.name);
      if (path.extname(filePath) === '.css') {
        console.log(filePath);
        const readStream = fs.createReadStream(filePath, 'utf-8');
        readStream.pipe(writeableStream);
      }
    }
  });
};

bundleStyles(dirPath);
