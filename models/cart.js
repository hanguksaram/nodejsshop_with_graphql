const Product = require("./product");
const simpleCartInMemoryStorage = [];

module.exports = class Cart {
  static addProduct(id) {
    const prodInd = simpleCartInMemoryStorage.findIndex(
      el => el.product.id == id
    );
    if (prodInd != -1) {
      simpleCartInMemoryStorage[prodInd].count++;
      return Promise.resolve();
    }
    return Product.findById(id).then(book => {
      simpleCartInMemoryStorage.push({ product: book, count: 1 });
      console.log(simpleCartInMemoryStorage);
      return true;
    });
  }
  static getCart() {
    if (simpleCartInMemoryStorage.length > 0) {
      const productsWithCalculatedCosts = simpleCartInMemoryStorage.map(el => {
        return {
          ...el.product,
          cost: el.product.price * el.count,
          count: el.count
        };
      });
      const totalPrice = productsWithCalculatedCosts
        .map(el => el.cost)
        .reduce((acc, c) => acc + c);

      return {
        products: productsWithCalculatedCosts,
        totalPrice
      };
    } else {
      return false;
    }
  }
  static changeProductCountInCart(increment, productId) {
    const indx = simpleCartInMemoryStorage.findIndex(el => el.product.id == productId)
    if (indx != -1) {
      simpleCartInMemoryStorage[indx].count += Number(increment)
      if (simpleCartInMemoryStorage[indx].count <= 0) {
        simpleCartInMemoryStorage.splice(indx, 1)
        console.log(simpleCartInMemoryStorage )
      }
      return true
    }
    return false 
  }

  static deleteProductFromCart(productId) {
    const indx = simpleCartInMemoryStorage.findIndex(el => el.product.id == productId)

    if (indx != -1) {
      simpleCartInMemoryStorage.splice(indx, 1)
      return true
    } else {
      return false
    }
  }
};
