const fs = require("fs");
const Cache = require("../models/simpleCache");
const path = require("path").join(
  require("path").dirname(process.mainModule.filename),
  "data",
  "products.json"
);
const cache = new Cache();

const getProductsFromFile = cb => {
  fs.readFile(path, (err, data) => {
    cb(!err && data.length > 0 ? JSON.parse(data) : []);
  });
};

module.exports = class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this.id = Math.ceil(Math.random() * 1000000);
  }

  save() {
    getProductsFromFile(products => {
      products.push(this);
      new Promise((resolve, reject) => {
        resolve(
          fs.writeFile(path, JSON.stringify(products), err => {
            reject(err);
          })
        );
      }).then(() => cache.setBook(this), error => console.log(error));
    });
  }

  //promise way
  static fetchAll() {
    console.log(cache.cache);
    return new Promise((resolve, reject) => {
      fs.readFile(path, (err, data) => {
        resolve(!err && data.length > 0 ? JSON.parse(data) : []);
      });
    });
  }
  static findById(productId) {
    const book = cache.book(productId);
    if (book.exist) {
      return Promise.resolve(book.book);
    } else {
      return new Promise((resolve, reject) => {
        fs.readFile(path, (error, data) => {
          if (error) reject(error);
          else {
            resolve(JSON.parse(data).find(book => book.id == productId));
          }
        });
      });
    }
  }
  //callback way
  static fetchAllCb(cb) {
    getProductsFromFile(cb);
  }
};
