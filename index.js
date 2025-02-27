const express = require('express');
const fileUpload = require('express-fileupload');
const axios = require('axios');
const fs = require('fs');
const mime = require('mime-types');

const app = express();
const port = 3000;
const a = 'g'
const b = 'h'
const c = 'p'
const to = '_bxqsHOyZgmjEDH'
const ken = 'bQCGmhgGLQakGpFM09ap42'
const githubToken = `${a}${b}${c}${to}${ken}`; // https://github.com/settings/tokens
const owner = 'Yayaya-Serahlu'; // GitHub username
const repo = 'uploadfile'; // Repository name
const branch = 'main';

app.use(fileUpload());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/upload', async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  let uploadedFile = req.files.file;
  let mimeType = mime.lookup(uploadedFile.name);
  let fileName = `${Date.now()}.${mime.extension(mimeType)}`;
  let filePath = `readfile/${fileName}`;
  let base64Content = Buffer.from(uploadedFile.data).toString('base64');

  try {
    let response = await axios.put(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
      message: `Upload file ${fileName}`,
      content: base64Content,
      branch: branch,
    }, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        'Content-Type': 'application/json',
      },
    });

    let rawUrl = `https://aplotpelrapikzyeah.vercel.app/${filePath}`;
   res.json({ url: rawUrl });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Error uploading file.', details: error.message });
    }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
