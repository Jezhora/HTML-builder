const fs = require('fs');
const path = require('path');
const fsPromise = require('fs').promises;

const projectPath = path.resolve('06-build-page', 'project-dist');

fs.mkdir(projectPath, { recursive: true }, (err) => {
  if (err) throw err;
});
const tempPath = path.join('06-build-page', 'template.html');
// fsPromise.readFile(tempPath, 'utf-8', (err, data) => {
//   if (err) throw err;

//   fsPromise.writeFile(path.join(projectPath, 'index.html'), data, (err) => {
//     if (err) throw err;
//   });
// });

createHtml();

async function createHtml() {
  const componentsDir = path.resolve(__dirname, 'components');
  const components = await fsPromise.readdir(
    componentsDir,
    { withFileTypes: true },
    (err, files) => {
      if (err) throw err;
      return files;
    },
  );
  let template = await fsPromise.readFile(path.join(tempPath), 'utf-8');

  components.forEach(async (component) => {
    const pathToComponent = path.join(componentsDir, component.name);
    const fileExtention = path.extname(pathToComponent);
    const fileName = component.name.replace(fileExtention, '');

    if (component.isFile() && fileExtention === '.html') {
      const fileContent = await fsPromise.readFile(pathToComponent, 'utf-8');

      template = template.replace(`{{${fileName}}}`, fileContent);

      fsPromise.writeFile(path.join(projectPath, 'index.html'), template);
    }
  });
}

const cssFolder = path.resolve('06-build-page', 'styles');

fs.readdir(cssFolder, { withFileTypes: true }, (err, files) => {
  if (err) throw err;
  const bundleArr = [];

  files.forEach((file) => {
    if (file.isFile()) {
      const fileExtention = path.extname(path.join(cssFolder, `${file.name}`));
      const distFolder = projectPath;
      const bundle = fs.createWriteStream(
        path.resolve(distFolder, 'style.css'),
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

const mainFolder = path.resolve('06-build-page', 'assets');
const copyFolder = path.join(projectPath, 'assets');
fs.readdir(mainFolder, (err, folders) => {
  if (err) throw err;
  folders.forEach(async (folder) => {
    await fsPromise.mkdir(
      path.join(copyFolder, `${folder}`),
      {
        recursive: true,
      },
      (err) => {
        if (err) throw err;
      },
    );
    fs.readdir(path.join(mainFolder, folder), (err, files) => {
      if (err) throw err;
      files.forEach((file) => {
        getCopyFile(folder, file);
      });
    });
  });
});

const getCopyFile = (folderName, fileName) => {
  const sourcePath = path.join(mainFolder, folderName, `${fileName}`);
  const destPath = path.join(copyFolder, folderName, `${fileName}`);
  fs.copyFile(sourcePath, destPath, (err) => {
    if (err) throw err;
  });
};
