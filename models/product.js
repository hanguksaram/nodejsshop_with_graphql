const fs = require("fs");
const path = require("path").join(
  require("path").dirname(process.mainModule.filename),
  "data",
  "products.json"
);

const getProductsFromFile = cb => {
  fs.readFile(path, (err, data) => {
    cb(!err ? JSON.parse(data) : []);
  });
};

module.exports = class Product {
  constructor(t) {
    this.title = t;
  }

  save() {
    getProductsFromFile(products => {
      products.push(this);
      fs.writeFile(path, JSON.stringify(products), err => {
        console.log;
      });
    });
  }

  //promise way
  static fetchAll() {
    return new Promise((resolve, reject) => {
      fs.readFile(path, (err, data) => {
        resolve(!err ? JSON.parse(data) : []);
      });
    });
  }
  //callback way
  static fetchAllCb(cb) {
    getProductsFromFile(cb);
  }
};
