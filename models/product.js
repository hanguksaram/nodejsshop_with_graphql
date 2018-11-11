const path = require("path").join(
  require("path").dirname(process.mainModule.filename),
  "data",
  "products.json"
);

const fs = require("fs");
const Cache = require("../models/simpleCache");
const FileRepo = require("../util/fileRepo");

const cache = new Cache();
const fileRepo = new FileRepo(path);

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
    this.id = id;
  }

  save() {
    fileRepo.input().then(data => {
        if (this.id == -1) {
          this.id = Math.ceil(Math.random() * 1000000);
          data.push(this);
          console.log("pushe", this);
        } else {
          const productIndex = data.findIndex(prod => this.id == prod.id);
          if (productIndex != -1) {
            data[productIndex] = this;
          }
        }
      
      fileRepo.output(data).then(() => cache.setBook(this));
    });
  }

  //promise way
  static fetchAll() {
    return fileRepo.input();
  }
  static findById(productId) {
    const book = cache.book(productId);
    if (book.exist) {
      return Promise.resolve(book.book);
    } else {
      return fileRepo.input().then(data => {
        const prod = data.find(prod => productId == prod.id);
        if (prod) {
          cache.setBook(prod);
          return prod;
        } else {
          return null;
        }
      });
    }
  }


  static deleteProduct(product) {
    return fileRepo.input().then(data => {
      const dataChanged = data.filter(prod => prod.id != product);
      if (dataChanged.length != data.length) {
        return fileRepo.output(dataChanged).then(() => {
          cache.deleteBook(product);
          return true
        })
      } else {
        return false 
      }
    })
  }
}
