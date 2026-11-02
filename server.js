
const express = require('express');

const app = express();


app.use(express.json());

const PORT = 3000;


let books = [];


app.get('/', (req, res) => {
    res.send("Book Management API is running");
});



app.post('/api/books', (req, res) => {

    const { id, title, author, category, quantity, available } = req.body || {};

    
    if (
        id === undefined || !title || !author ||
        !category || quantity === undefined ||
        available === undefined
    ) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Invalid book ID"
        });
    }

    
    if (
        !Number.isInteger(quantity) ||
        !Number.isInteger(available) ||
        quantity < 0 ||
        available < 0 ||
        available > quantity
    ) {
        return res.status(400).json({
            message: "Invalid quantity values"
        });
    }

    
    const existingBook = books.find(book => book.id === id);

    if (existingBook) {
        return res.status(400).json({
            message: "Book ID already exists"
        });
    }

    
    const newBook = {
        id,
        title,
        author,
        category,
        quantity,
        available
    };

    books.push(newBook);

    res.status(201).json({
        message: "Book added successfully",
        book: newBook
    });
});



app.get('/api/books', (req, res) => {

    if (books.length === 0) {
        return res.status(200).json({
            message: "No books available",
            books: []
        });
    }

    res.status(200).json(books);
});



app.get('/api/books/:id', (req, res) => {

    const id = Number(req.params.id);

    const book = books.find(book => book.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.status(200).json(book);
});



app.put('/api/books/:id', (req, res) => {

    const id = Number(req.params.id);

    const book = books.find(book => book.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const { title, author, category, quantity, available } = req.body || {};


    if (
        (title !== undefined && (typeof title !== 'string' || !title.trim())) ||
        (author !== undefined && (typeof author !== 'string' || !author.trim())) ||
        (category !== undefined && (typeof category !== 'string' || !category.trim()))
    ) {
        return res.status(400).json({
            message: "Invalid book details"
        });
    }

    
    if (
        (quantity !== undefined &&
            (!Number.isInteger(quantity) || quantity < 0)) ||
        (available !== undefined &&
            (!Number.isInteger(available) || available < 0))
    ) {
        return res.status(400).json({
            message: "Invalid quantity values"
        });
    }


    const newQuantity = quantity !== undefined ? quantity : book.quantity;
    const newAvailable = available !== undefined ? available : book.available;

    if (newAvailable > newQuantity) {
        return res.status(400).json({
            message: "Available cannot exceed quantity"
        });
    }

    // Update permitted fields
    if (title !== undefined) book.title = title;
    if (author !== undefined) book.author = author;
    if (category !== undefined) book.category = category;
    if (quantity !== undefined) book.quantity = quantity;
    if (available !== undefined) book.available = available;

    res.status(200).json({
        message: "Book updated successfully",
        book: book
    });
});


 
app.delete('/api/books/:id', (req, res) => {

    const id = Number(req.params.id);

    // Find book index
    const index = books.findIndex(book => book.id === id);

    // Check if book exists
    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    // Delete book
    books.splice(index, 1);

    res.status(200).json({
        message: "Book deleted successfully"
    });
});


// TASK 6: Search books
app.get('/api/books/search', (req, res) => {

    const search = req.query.q;

    if (!search) {
        return res.status(400).json({
            message: "Please enter a search keyword"
        });
    }

    const result = books.filter(book =>
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase()) ||
        book.category.toLowerCase().includes(search.toLowerCase())
    );

    if (result.length === 0) {
        return res.status(404).json({
            message: "No books found"
        });
    }

    res.status(200).json({
        message: "Books found successfully",
        books: result
    });
});



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
