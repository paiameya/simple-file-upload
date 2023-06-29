const express = require('express');
const cors = require('cors')
const multer = require('multer');
const path = require('path');
const generateUniqueId = require('./utils/')
const fs = require('fs')

let finalFilenam = ""
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    const filename = file.originalname.substring(0, file.originalname.lastIndexOf('.')).replace(/[^a-zA-Z0-9]/g, '') + generateUniqueId()
    const fileExtension = file.originalname.substring(file.originalname.lastIndexOf('.') + 1, file.originalname.length)
    callback(null, filename + '.' + fileExtension);
    finalFilenam = filename + '.' + fileExtension
  }
});

const upload = multer({ storage: storage }).single('file');

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))
// It's very crucial that the file name matches the name attribute in your html
app.post('/file', upload, (req, res) => {
  console.log(17)
  return res.send('http://localhost:3000/file/' + finalFilenam)
});

app.use('/file', express.static(path.join(__dirname, 'uploads')))

app.delete('/file/:name', (req, res) => {
  console.log(req.params.name)
  if (!req.params.name.trim()) {
    return res.status(400).send('Request body must be a json and must contain path which provides path to the file')
  }
  const fileLocalPath = "./uploads/" + req.params.name
  fs.unlink(fileLocalPath, (err) => {
    if (err) {
      console.error(err)
      return
    }
    return res.send('file deleted')
    //file removed
  })
})

app.listen(3000);
