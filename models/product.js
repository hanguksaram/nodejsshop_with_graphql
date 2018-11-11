const path = require("path").join(
  require("path").dirname(process.mainModule.filename),
  "data",
  "products.json"
);


const fs = require("fs");
const Cache = require("../models/simpleCache");
const FileRepo = require('../util/fileRepo')


const cache = new Cache();
const fileRepo = new FileRepo(path)

const getProductsFromFile = cb => {
  fs.readFile(path, (err, data) => {
    cb(!err && data.length > 0 ? JSON.parse(data) : []);
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this.id = (id == 0) ? Math.ceil(Math.random() * 1000000): id
  }

  save(biConsumer) {
    fileRepo.input().then(data => {
      if (data.length) > 0
    })
    fileRepo.output
    getProductsFromFile(products => {
      biConsumer(products, this) 
      .then(() => cache.setBook(this), error => console.log(error));
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
      ;
    }
  }
  //callback way
  static fetchAllCb(cb) {
    getProductsFromFile(cb);
  };

  static deleteProduct(product) {
    getProductsFromFile(products => {
      products = products.filter(prod => prod.id != product.id)
    })
  }
};
