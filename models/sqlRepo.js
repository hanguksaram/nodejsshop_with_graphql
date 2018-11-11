const db = require("../util/database");
const EventEmitter = require("events");

class CustomEmitter extends EventEmitter {}

const sqlEmitter = new CustomEmitter();

const sqlFuncSequence = [];

class SqlRepo {
    static findAll() {
        return db.execute("SELECT * FROM producs");
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

const sqlIntervalEnchancer = ({promise, interval, lap, customEvent}) => {
  let err = true;
  let count = 0;
  return () => {
    const intId = setInterval(() => {
      if (!err || count == lap) {
        clearInterval(intId);
      } else {
        promise()
          .then(data => {
            err = false;
            sqlEmitter.emit(customEvent, data);
          })
          .catch(error => {
            console.log("trying to fetch data again " + count);
            count++;
          });
      }
    }, interval);
  };
};

sqlFuncSequence.push({promise: SqlRepo.findAll, interval: 2000, lap: 10, customEvent: 'selectAll'});
module.exports = {
  sqlEmitter,
  sqlHandlers: sqlFuncSequence.map(el => {
      return {key: el.customEvent, fn: sqlIntervalEnchancer({...el})}
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
