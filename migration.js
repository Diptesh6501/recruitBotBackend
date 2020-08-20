const fs = require('fs');
const PdfReader = require('pdfreader').PdfReader;
const connectMongo = require('./config/connection');
const path = require('path');

const str = '';
const candidate = require('./models/candidate.model.js');
connectMongo();

async function findCandidate(filename, str) {
  candidate.find({ filename: filename }, (err, data) => {
    if (err) {
      throw err;
    }
    data.forEach(ele => {
      console.log('updating candidate here', ele.fName);
      candidate.updateMany({ filename: ele.filename }, { resumeTxt: str }, (err, data) => {
        if (err) {
          throw err
        }
        console.log('----->', data);
      })
    })
  })
}

let directoryPath = '../resumes';
fs.readdir(directoryPath, (err, files) => {
  files.forEach((ele) => {
    let str = '';
    let filePath = '../resumes' + '/' + ele;
    if (path.extname(filePath) === ".pdf") {
      fs.readFile(filePath, (err, pdfBuffer) => {
        new PdfReader().parseBuffer(pdfBuffer, async (err, item) => {
          if (err) {
            throw err;
          }
          if (Boolean(item) && item.text !== undefined) {
            str = str + ' ' + item.text;
          } else if (!Boolean(item)) {
            await findCandidate(ele, str);
          }
        });
      });
    }
  })
});
