const fs = require('fs');
const path = require('path');

const stream = fs.createReadStream(
  path.resolve('01-read-file', 'text.txt'),
  'utf-8',
);

stream.on('data', (data) => console.log(data));
stream.on('error', (error) => console.log(error));
