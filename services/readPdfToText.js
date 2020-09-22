const fs = require('fs');
const PdfReader = require('pdfreader').PdfReader;
const path = require('path');

function readPdfToText(filePath) {
    let str = '';
    if (filePath) {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, (err, pdfBuffer) => {
                new PdfReader().parseBuffer(pdfBuffer, async (err, item) => {
                    if (err) {
                        reject(err);
                    }
                    if (Boolean(item) && item.text !== undefined) {
                        str = str + ' ' + item.text;
                    } else if (!item) {
                        resolve(str)
                    }
                });
            });
        })
    }
}


module.exports = readPdfToText;