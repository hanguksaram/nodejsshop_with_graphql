const db = require('../util/database')
const sqlFuncSequence = []

const findAll = () => {
    return db.execute('SELECT * FROM products')
}


const intervalErrorDbHandler = (fn, timeout, lap) => {
    let intervalId = undefined;
    let count = 0;
    return () => {
        return fn().then((data) => {
            if (intervalId) {
                clearInterval(intervalId);
                console.log("in then")
                return data
            }
        }, () => {
            intervalId = setInterval(() => {
                if (count == lap) clearInterval(intervalId)
                count++,
                console.log("in error")
                fn()
            }, timeout)
        })
    }   
}

sqlFuncSequence.push(findAll)
exports.sqlHandlers = sqlFuncSequence.map(fn => intervalErrorDbHandler(fn, 1000, 5))

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
