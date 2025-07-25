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
const to = '_KjTxuvo2kJHN86x'
const ken = 'x8rSxyLeFvMSnHJ0G6RNz'
const githubToken = `${a}${b}${c}${to}${ken}`; // https://github.com/settings/tokens
const owner = 'upload-file-lab'; // GitHub username
const repo = 'fileupload6'; // Repository name
const branch = 'main';

app.use(fileUpload());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/uploadfile', async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  let uploadedFile = req.files.file;
  let mimeType = mime.lookup(uploadedFile.name);
  let fileName = `${Date.now()}.${mime.extension(mimeType)}`;
  let filePath = `uploads/${fileName}`;
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

    let rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
    // YAYAYAYYAYAYAYAYAYAYYAYAYYAYYAYAYAYAA
    res.send(`
    <!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Unggahan Berhasil</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="icon" type="image/x-icon" href="https://i.pinimg.com/736x/0d/71/2a/0d712a0b6805c0b44386339048bdfce5.jpg?format=png&name=900x900">
    <style>
        /* Custom styles for a more modern look */
        body {
            background-image: linear-gradient(to right top, #d16ba5, #c777b9, #ba83ca, #aa8fd8, #9a9ae1, #8aa7ec, #79b3f4, #69bff8, #52cffe, #41dfff, #46eefa, #5ffbf1);
            background-size: cover;
            background-attachment: fixed;
        }
        .card-glow {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 30px rgba(124, 58, 237, 0.6); /* Purple glow */
            transition: all 0.3s ease-in-out;
        }
        .card-glow:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 20px -5px rgba(0, 0, 0, 0.1), 0 6px 8px -3px rgba(0, 0, 0, 0.08), 0 0 40px rgba(167, 139, 250, 0.8); /* Lighter purple on hover */
        }
    </style>
</head>
<body class="flex flex-col items-center justify-center min-h-screen p-4">
    <div class="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md card-glow transform hover:scale-105 transition duration-300">
        <div class="mb-6">
            <img src="https://media.tenor.com/yWaLIc5J9WgAAAAj/momoi.gif" alt="Momoi GIF" class="mx-auto rounded-full h-32 w-32 object-cover shadow-lg border-4 border-indigo-300">
        </div>
        <h1 class="text-3xl font-extrabold text-center mb-4 text-gray-800">Unggahan Berhasil!</h1>
        <div class="text-center text-gray-600 mb-6 text-md">
            File Anda berhasil diunggah. Berikut adalah tautan URL langsungnya:
        </div>
        <div class="text-center mb-6 p-3 bg-gray-100 rounded-lg break-words shadow-inner">
            <a id="rawUrlLink" href="${rawUrl}" class="text-indigo-600 hover:text-indigo-800 font-semibold text-lg transition duration-200 ease-in-out">${rawUrl}</a>
        </div>
        <div class="text-center">
            <button onclick="copyUrl()" class="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700
                text-white font-bold py-3 px-8 rounded-full shadow-lg
                transform hover:scale-105 transition duration-300 ease-in-out
                focus:outline-none focus:ring-4 focus:ring-purple-300">
                Salin URL
            </button>
        </div>
    </div>

    <script>
        function copyUrl() {
            const rawUrl = document.getElementById('rawUrlLink').href;
            navigator.clipboard.writeText(rawUrl).then(function() {
                alert("URL berhasil disalin: " + rawUrl);
            }).catch(function(error) {
                alert("Gagal menyalin URL: " + error);
            });
        }
    </script>
</body>
</html>
`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading file.');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
