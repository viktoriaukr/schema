process.env.NODE_ENV = "test";
const db = require("../db");

const Book = require("../models/book");

let bookInfo;
describe("Test Book class", () => {
  beforeEach(async () => {
    await db.query(`DELETE FROM books`);
    bookInfo = await Book.create({
      isbn: "0691161518",
      amazon_url: "http://a.co/eobPtX2",
      author: "Matthew Lane",
      language: "english",
      pages: 264,
      publisher: "Princeton University Press",
      title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
      year: 2017,
    });
  });
  test("get single book", async () => {
    let book = await Book.findOne("0691161518");
    expect(book).toEqual(bookInfo);
  });

  test("get multiple books", async () => {
    let books = await Book.findAll();
    expect(books).toEqual([bookInfo]);
  });

  test("create new book", async () => {
    let book = await Book.create({
      isbn: "9745397854",
      amazon_url: "http://a.co/eobPtX2",
      author: "Matthew Lane",
      language: "english",
      pages: 264,
      publisher: "Princeton University Press",
      title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
      year: 2017,
    });
    expect(book).toEqual({
      isbn: "9745397854",
      amazon_url: "http://a.co/eobPtX2",
      author: "Matthew Lane",
      language: "english",
      pages: 264,
      publisher: "Princeton University Press",
      title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
      year: 2017,
    });
  });

  test("update a book", async () => {
    let book = await Book.update("0691161518", {
      amazon_url: "http://a.co/eobPtX2",
      author: "Matthew",
      language: "en",
      pages: 264,
      publisher: "Princeton University Press",
      title: "Unlocking the Hidden Mathematics in Video Games",
      year: 2019,
    });
    expect(book).toEqual({
      isbn: "0691161518",
      amazon_url: "http://a.co/eobPtX2",
      author: "Matthew",
      language: "en",
      pages: 264,
      publisher: "Princeton University Press",
      title: "Unlocking the Hidden Mathematics in Video Games",
      year: 2019,
    });
  });

  afterAll(async () => {
    await db.end();
  });
});
