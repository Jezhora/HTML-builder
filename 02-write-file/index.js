const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = process;

const createFile = fs.createWriteStream(
  path.resolve('02-write-file', 'text.txt'),
  'utf-8',
);
stdout.write('Hello, write something\n');

const stopProcess = () => {
  stdout.write('\n\nSee you later :) Bye!\n\n');
  exit();
};

stdin.on('data', (data) => {
  const exitData = data.toString().toLowerCase().trim();
  if (exitData === 'exit') stopProcess();
  createFile.write(data);
});

process.on('SIGINT', () => {
  stopProcess();
});
