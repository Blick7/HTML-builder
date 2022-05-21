const fs = require('fs/promises');
const path = require('path');
const dirInitial = path.join(__dirname, '/files');
const dirCopy = path.join(__dirname, '/files-copy');

const copyDirectory = async (dirInitial, dirCopy) => {
  await fs.rm(dirCopy, { recursive: true, force: true });
  await fs.mkdir(dirCopy, { recursive: true });

  const files = await fs.readdir(dirInitial, { withFileTypes: true });

  for (const file of files) {
    const sourcePath = path.join(dirInitial, file.name);
    const destPath = path.join(dirCopy, file.name);
    if (file.isFile()) {
      await fs.copyFile(sourcePath, destPath);
    } else {
      await copyDirectory(sourcePath, destPath);
    }
  }
};

copyDirectory(dirInitial, dirCopy);
