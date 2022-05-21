const path = require('path');
const fs = require('fs');
const dir = path.join(__dirname, './secret-folder');

const showFiles = (dir) => {
  fs.readdir(dir, { withFileTypes: true }, (err, files) => {
    if (err) throw Error(err);
    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(dir, file.name);
        const fileName = path.parse(filePath).name;
        const fileExtension = path.extname(file.name).slice(1);
        fs.stat(filePath, (err, stats) => {
          const fileSize = (stats.size / 1024).toFixed(3);
          console.log(
            fileName + ' - ' + fileExtension + ' - ' + fileSize + 'kb'
          );
        });
      }
    }
  });
};

showFiles(dir);
