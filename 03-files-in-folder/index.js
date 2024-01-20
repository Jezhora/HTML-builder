const fs = require('fs');
const path = require('path');

fs.readdir(
  path.resolve('03-files-in-folder', 'secret-folder'),
  { withFileTypes: true },
  (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      if (file.isFile()) {
        const filePath = path.resolve(
          '03-files-in-folder',
          'secret-folder',
          `${file.name}`,
        );
        const fileName = path.parse(filePath).name;
        const fileExtention = path.parse(filePath).ext.slice(1);
        fs.stat(filePath, (err, stats) => {
          if (err) throw err;
          const kB = `${stats.size / 1000}kb`;
          console.log(`${fileName} - ${fileExtention} - ${kB}`);
        });
      }
    });
  },
);
