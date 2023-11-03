process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const db = require("../db");

let bookInfo;

beforeEach(async () => {
  const res = await db.query(`
  INSERT INTO
    books (isbn, amazon_url,author,language,pages,publisher,title,year)
    VALUES(
      '123432122',
      'https://amazon.com/taco',
      'Elie',
      'English',
      100,
      'Nothing publishers',
      'my first book', 2008)
    RETURNING isbn, amazon_url, author, language, pages, publisher, title, year`);
  bookInfo = res.rows[0];
});

describe("get routes", () => {
  test("get books information", async () => {
    const res = await request(app).get("/books");
    const books = res.body.books;
    expect(res.statusCode).toEqual(200);
    expect(books[0]).toHaveProperty("language");
    expect(books[0]).toHaveProperty("author");
    expect(books[0]).toHaveProperty("isbn");
  });
  test("get single book information", async () => {
    const res = await request(app).get(`/books/${bookInfo.isbn}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.book).toEqual({
      amazon_url: "https://amazon.com/taco",
      author: "Elie",
      isbn: "123432122",
      language: "English",
      pages: 100,
      publisher: "Nothing publishers",
      title: "my first book",
      year: 2008,
    });
  });
});

describe("/POST", () => {
  test("create a new book", async () => {
    const res = await request(app).post("/books").send({
      amazon_url: "https://amazon.com/taco",
      author: "Melvin",
      isbn: "123432456",
      language: "English",
      pages: 305,
      publisher: "Nothing publishers",
      title: "my first book",
      year: 2010,
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body.book).toEqual({
      amazon_url: "https://amazon.com/taco",
      author: "Melvin",
      isbn: "123432456",
      language: "English",
      pages: 305,
      publisher: "Nothing publishers",
      title: "my first book",
      year: 2010,
    });
  });
});

// describe("/PUT", () => {
//   test("update a book", async () => {
//     console.log(bookInfo.isbn);
//     const res = await request(app).put(`/books/${bookInfo.isbn}`).send({
//       amazon_url: "https://amazon.com/taco/book",
//       author: "eliot",
//       language: "english",
//       pages: 343,
//       publisher: "Good publishers",
//       title: "updated book",
//       year: 2009,
//     });
//     console.log(res.body.book);
//     expect(res.statusCode).toEqual(200);
//     expect(res.body.book).toEqual({
//       amazon_url: "https://amazon.com/taco/book",
//       author: "eliot",
//       isbn: "123432122",
//       language: "english",
//       pages: 343,
//       publisher: "Good publishers",
//       title: "updated book",
//       year: 2009,
//     });
//   });
// });

describe("/DELETE", () => {
  test("delete book", async () => {
    const res = await request(app).delete(`/books/${bookInfo.isbn}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "Book deleted" });
  });
});
afterEach(async () => {
  await db.query(`DELETE FROM books`);
});

afterAll(async () => {
  await db.end();
});
