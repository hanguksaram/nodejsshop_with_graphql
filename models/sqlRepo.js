const db = require("../util/database");
const EventEmitter = require("events");

class CustomEmitter extends EventEmitter {}

const sqlEmitter = new CustomEmitter();

const sqlFuncSequence = [];

class SqlRepo {
  static findAll() {
    return db.execute("SELECT * FROM products");
  }
  static insertNew(product) {
    return db.execute(
      "INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)",
      [product.title, product.price, product.imageUrl, product.description]
    );
  }
  static findById(id) {
    return db.execute("SELECT * from products WHERE products.id = ?", [id]);
  }
}

const intervalErrorDbHandler = (fn, timeout, lap) => {
  let intervalId = null;
  let count = 0;
  return () => {
    return fn().then(
      data => {
        if (intervalId) {
          clearInterval(intervalId);
          console.log("in then");
          return data;
        }
      },
      () => {
        intervalId = setInterval(() => {
          if (count == lap) clearInterval(intervalId);
          count++, console.log("in error");
          fn();
        }, timeout);
      }
    );
  };
};

const sqlIntervalEnchancer = ({
  mode = "timeout",
  promise,
  interval = 2000,
  lap = 5,
  customEvent
}) => {
  let err = true;
  let count = 0;
  const promiseTimeoutUtil = optArg => {
    if (count == lap) return Promise.reject();
    count++;
    return promise(optArg)
      .then(data => {
        //two way data transporting, ll use it later
        sqlEmitter.emit(customEvent, data);
        return data;
      })
      .catch(error => {
        setTimeout(() => {
          console.log(error);
          promiseIntervalUtil(optArg);
        }, interval);
      });
  };
  const promiseIntervalUtil = optArg => {
    const intId = setInterval(() => {
      if (!err || count == lap) {
        clearInterval(intId);
      } else {
        promise(optArg)
          .then(data => {
            err = false;
            sqlEmitter.emit(customEvent, data);
            return data;
          })
          .catch(error => {
            console.log(error);
            count++;
          });
      }
    }, interval);
  };
  return mode === "timeout" ? promiseTimeoutUtil : promiseIntervalUtil;
};

sqlFuncSequence.push({
  mode: "timeout",
  promise: SqlRepo.findAll,
  interval: 2000,
  lap: 5,
  customEvent: "selectAll"
});
sqlFuncSequence.push({
  mode: "timeout",
  promise: SqlRepo.insertNew,
  interval: 2000,
  lap: 5,
  customEvent: "createNewProduct"
});
sqlFuncSequence.push({
  promise: SqlRepo.findById,
  customEvent: "findProductById"
});

module.exports = {
  sqlEmitter,
  sqlHandlers: sqlFuncSequence.map(el => {
    return { key: el.customEvent, fn: sqlIntervalEnchancer({ ...el }) };
  })
};

// module.exports = class SqlRepo {
//     static findAll() {
//         return db.execute('SELECT * FROM products')
//             .then(([rows, fielData]) => {
//                 return rows
//             })
//     }
//     static create(product) {

//     //     db.execute('INSERT INTO products (title, price, imageUrl, description')
//     //         .then(() => {
//     //             if (interval) {
//     //                 clearInterval(interval)
//     //             }
//     //         }, () => {
//     //             interval = setInterval(() => {
//     //                 this.create(product)
//     //             })
//     //         })
//     }
//     static update(product) {

//     }
// }
