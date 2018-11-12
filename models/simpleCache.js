module.exports = class Cache {
    constructor() {
        this.cache = new Map()
    }
    book(id) {
        id = Number(id)
        return this.cache.has(id) 
            ? {book: this.cache.get(id), exist: true } : 
        {exist: false}
    }
    setBook(book) {
        this.cache.set(book.id, book)
    }
    deleteBook(book) {
        this.cache.delete(book.id)
    }
}