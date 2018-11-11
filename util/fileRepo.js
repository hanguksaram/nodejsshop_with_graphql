const fs = require("fs");

module.exports = class FileRepo {
  constructor(filePath) {
    this.filePath = filePath;
  }
  output(data) {
    return new Promise((resolve, reject) => {
      resolve(
        fs.writeFile(this.filePath, JSON.stringify(data), err => {
          reject(err);
        })
      );
    });
  }

  input() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.filePath, (error, data) => {
        if (error) reject(error);
        else { 
            resolve(data.length > 0 ? JSON.parse(data) : []);
        }
      });
    });
  }
};
