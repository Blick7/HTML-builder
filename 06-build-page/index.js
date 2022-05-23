const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const bundlePath = path.join(__dirname, '/project-dist');
const htmlPath = path.join(bundlePath, '/index.html');
const cssPath = path.join(bundlePath, '/style.css');

const dirInitial = path.join(__dirname, '/assets');
const dirCopy = path.join(__dirname, '/project-dist/assets');

fsp.mkdir(bundlePath, { recursive: true }); // create dist

const copyDirectory = async (dirInitial, dirCopy) => {
  await fsp.rm(dirCopy, { recursive: true, force: true });
  await fsp.mkdir(dirCopy, { recursive: true });

  const files = await fsp.readdir(dirInitial, { withFileTypes: true });

  for (const file of files) {
    const sourcePath = path.join(dirInitial, file.name);
    const destPath = path.join(dirCopy, file.name);
    if (file.isFile()) {
      await fsp.copyFile(sourcePath, destPath);
    } else {
      await copyDirectory(sourcePath, destPath);
    }
  }
};

const bundleHtml = async () => {
  const components = path.join(__dirname, '/components');
  const files = await fsp.readdir(components, { withFileTypes: true });

  const writeableStreamHtml = await fs.createWriteStream(htmlPath);
  const templatePath = path.join(__dirname, 'template.html');
  const readableStreamTemplateHtml = await fs.createReadStream(
    templatePath,
    'utf-8'
  );
  readableStreamTemplateHtml.on('data', async (chunk) => {
    for (let file of files) {
      const filePath = path.join(components, file.name);
      const fileName = path.parse(filePath).name;
      if (chunk.toString().includes(`{{${fileName}}}`)) {
        chunk = chunk
          .toString()
          .replace(
            `{{${fileName}}}`,
            await fsp.readFile(`./06-build-page/components/${fileName}.html`)
          );
      }
    }
    writeableStreamHtml.write(chunk);
  });
};

const stylesPath = path.join(__dirname, '/styles');

const bundleStyles = async (dir) => {
  const files = await fsp.readdir(dir, { withFileTypes: true });
  const writeableStream = fs.createWriteStream(cssPath);
  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.join(dir, file.name);
      if (path.extname(filePath) === '.css') {
        const readStream = fs.createReadStream(filePath, 'utf-8');
        readStream.pipe(writeableStream);
      }
    }
  });
};
copyDirectory(dirInitial, dirCopy);

bundleStyles(stylesPath);

bundleHtml();
