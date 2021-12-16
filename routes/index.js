var express = require('express');
var router = express.Router();
const Book = require('../models').Book;
const {Op} = require('../models').Sequelize;

/* GET home page, forward to page 1. */
router.get('/', function(req, res){
  res.redirect('/books/page-1');
});

/* GET home page, forward to page 1. */
router.get('/books', function(req, res){
  res.redirect('/books/page-1');
});

/* GET books by page number */
router.get('/books/page-:number', async(req, res, next)  => {
  let page = req.params.number; //current page number
  let limit = 10; //number of records per page
  let offset = limit * (page - 1);
  try {
      let data = await Book.findAndCountAll();
      let pages = Math.ceil(data.count / limit);

      let books = await Book.findAll({
        limit: limit,
        offset: offset,
      });
      res.render('books', {books: books, pages: pages});
    } catch (error) {
      next(error);
    }
});

/* GET all books */
router.get('/books/view-all', async(req, res, next)  => {
  try {
      const books = await Book.findAll();
      let pages = 0;
      res.render('books', {books: books, pages: pages});
    } catch (error) {
      next(error);
    }
});

/* GET search results */
router.get('/search?:search', async(req, res, next) => {
  try {
    const searchText = req.query.search;
    const results = await Book.findAll({
      where: {
        [Op.or]: [
          {
            title: {
              [Op.like]: `%${searchText}%`
            }
          },
          {
            author: {
              [Op.like]: `%${searchText}%`
            }
          },
          {
            genre: {
              [Op.like]: `%${searchText}%`
            }
          },
            {
            year: {
              [Op.like]: `%${searchText}%`
            }
          }
        ]
      }
    });
    if (results.length>0) {
      let endSearch = 'End Search';
      res.render('books', {books: results, endSearch: endSearch});
    } else {
      res.redirect('/search/no-results')
    }
  } catch (error) {
    next(error);
  }
});

/* GET create a route for no search results */
router.get('/search/no-results', (req, res) =>{
  res.render('search-error');
})

/* GET create a new book form */
router.get('/books/new', (req, res) => {
  res.render('books/new-book');
});

/* POST new book to database */
router.post('/books/new', async(req, res) => {
  let book;
  try{
    book = await Book.create(req.body);
    res.redirect('/books/page-1');
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = Book.build(req.body);
      res.render('books/new-book', {book, errors: error.errors});
  } else {
    throw error;
    }
  }
});

/* GET individual book details */
router.get('/books/:id', async(req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        res.render('books/update-book', {book: book})
    } else {
      const err = new Error;
      err.status = 404;
      err.message = "Bummer, it looks like the book you requested doesn't exist."
      next(err);
    } 
  } catch (error) {
    next(error)
  }
});

/* POST update a book in database */
router.post('/books/:id', async(req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect('/books/page-1');
    } else {
      const err = new Error;
      err.status = 404;
      err.message = "It looks like the book you are trying to update doesn't exist."
      next(err);
    }
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = Book.build(req.body);
      book.id = req.params.id;
      res.render('books/update-book', {book, errors: error.errors});
    } else {
      throw error;
    }
  }
})



/* POST deletes a book from the database */
router.post('/books/:id/delete', async(req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    res.redirect('/books/page-1');
  } else {
    const err = new Error;
    err.status = 404;
    err.message = "It looks like the book you are trying to delete doesn't exist."
    next(err);
  }
});

module.exports = router;
