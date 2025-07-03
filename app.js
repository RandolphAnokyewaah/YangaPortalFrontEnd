const path = require('path');
const express = require('express');
const app = express();

app.use(express.static(path.join(__dirname, './dist')));
app.use(express.static(path.join(__dirname, './public')));

app.get('*', (req, res) => {
  return res.sendFile(path.join(__dirname, './dist/index.html'));
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log('Listening on ' + PORT);
});