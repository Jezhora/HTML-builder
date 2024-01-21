const fs = require('fs');
const path = require('path');
const mainFolder = path.resolve('04-copy-directory', 'files');
const copyFolder = path.resolve('04-copy-directory', 'files-copy');

fs.mkdir(
  copyFolder,
  {
    recursive: true,
  },
  (err) => {
    if (err) throw err;
    console.log('The folder file-copy created successfully\n');
  },
);

const getCopyFile = (fileName) => {
  const sourcePath = path.join(mainFolder, `${fileName}`);
  const destPath = path.join(copyFolder, `${fileName}`);
  fs.copyFile(sourcePath, destPath, (err) => {
    if (err) throw err;
    console.log(`${fileName} copied successfully into \n ${copyFolder}\n`);
  });
};

const removeFile = (mainFiles) => {
  fs.readdir(copyFolder, { withFileTypes: true }, (err, copiedFiles) => {
    if (err) throw err;
    copiedFiles.forEach((copied) => {
      if (!mainFiles.includes(copied.name)) {
        fs.unlink(path.join(copyFolder, `${copied.name}`), (err) => {
          if (err) throw err;
        });
      }
    });
  });
};

fs.readdir(mainFolder, { withFileTypes: true }, (err, filesToCopy) => {
  if (err) throw err;
  const mainFiles = [];
  filesToCopy.forEach((file) => {
    mainFiles.push(file.name);
    if (file.isFile()) {
      getCopyFile(file.name);
    }
  });
  removeFile(mainFiles);
});
