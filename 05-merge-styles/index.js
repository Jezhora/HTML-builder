const fs = require('fs');
const path = require('path');

const cssFolder = path.resolve('05-merge-styles', 'styles');

fs.readdir(cssFolder, { withFileTypes: true }, (err, files) => {
  if (err) throw err;
  const bundleArr = [];

  files.forEach((file) => {
    if (file.isFile()) {
      const fileExtention = path.extname(path.join(cssFolder, `${file.name}`));
      const distFolder = path.join('05-merge-styles', 'project-dist');
      const bundle = fs.createWriteStream(
        path.resolve(distFolder, 'bundle.css'),
      );

      if (fileExtention === '.css') {
        const readStream = fs.createReadStream(
          path.resolve(cssFolder, `${file.name}`),
          'utf-8',
        );

        let bundleData = '';
        readStream.on('data', (chunk) => {
          bundleData += chunk;
          bundleArr.push(bundleData);
        });

        readStream.on('end', () => {
          bundleArr.forEach((data) => {
            bundle.write(data);
          });
        });
      }
    }
  });
});
