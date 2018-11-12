const Cache = require("../models/simpleCache");

const SqlRepo = require("./sqlRepo");
const cache = new Cache();

//sql handlers

const fetchAllHandler = SqlRepo.sqlHandlers.find(hn => hn.key == "selectAll");
const createNewHandler = SqlRepo.sqlHandlers.find(
  hn => hn.key === "createNewProduct"
);
const getProductHandler = SqlRepo.sqlHandlers.find(
  hn => hn.key === "findProductById"
);
//event handlers
SqlRepo.sqlEmitter.on(fetchAllHandler.key, data => {
  // console.log(data)
  // dispatchDataToController(data)
});
SqlRepo.sqlEmitter.on(createNewHandler.key, data => {
  // console.log('new product was created', data)
  // cache.setBook(this)
});
SqlRepo.sqlEmitter.on(getProductHandler.key, data => {
  console.log(data[0][0]);
  product = {...data[0][0]};
  cache.setBook(product)
  console.log(cache.cache)
});

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this.id = id;
  }

  save() {
    if (this.id == -1) {
      createNewHandler.fn(this);
    } else {
    }

    // SqlRepo.update(this)
    // fileRepo.input().then(data => {
    //     if (this.id == -1) {

    //       data.push(this);
    //       console.log("pushe", this);
    //     } else {
    //       const productIndex = data.findIndex(prod => this.id == prod.id);
    //       if (productIndex != -1) {
    //         data[productIndex] = this;
    //       }
    //     }

    //   fileRepo.output(data).then(() => cache.setBook(this));
    // });
  }

  //promise way
  static fetchAll() {
    return fetchAllHandler.fn();
  }

  static findById(productId) {
    const book = cache.book(productId);
    if (book.exist) {
      return Promise.resolve(book.book);
    } else {
      return getProductHandler.fn(productId).then(() => {
        return cache.book(productId);
      });
    }
  }

  static deleteProduct(product) {
    return fileRepo.input().then(data => {
      const dataChanged = data.filter(prod => prod.id != product);
      if (dataChanged.length != data.length) {
        return fileRepo.output(dataChanged).then(() => {
          cache.deleteBook(product);
          return true;
        });
      } else {
        return false;
      }
    });
  }
};
