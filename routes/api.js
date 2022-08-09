/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const { ObjectId } = require("mongodb");

module.exports = function (app, db) {
  const Book = db.collection('Book');

  app.route('/api/books')
    .get(async function (req, res) {
      const booksCursor = await Book.find({}, { title: 1, comments: 1 });
      const parsed = await booksCursor.toArray();
      const withCount = parsed.map(book => {
        return {
          ...book,
          commentcount: book.comments.length
        }
      })

      return res.send(withCount);
    })

    .post(async function (req, res) {
      let title = req?.body?.title;
      if (!title) {
        return res.send('missing required field title');
      }

      const { insertedId } = await Book.insertOne({ title, comments: [] });
      const inserted = await Book.findOne({ _id: insertedId });

      return res.send(inserted);
    })

    .delete(async function (req, res) {
      const { acknowledged } = await Book.deleteMany({})

      if (acknowledged) {
        return res.send('complete delete successful')
      }

      return res.sendStatus(200)
    });



  app.route('/api/books/:id')
    .get(async function (req, res) {
      let bookid = req.params.id;
      const _id = new ObjectId(bookid)
      let book = await Book.findOne({ _id })

      if (!book) {
        return res.send('no book exists')
      }

      return res.send(book)
    })

    .post(async function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;

      const _id = new ObjectId(bookid)

      let book = await Book.findOne({ _id })

      if (!comment) {
        return res.send('missing required field comment')
      }

      if (!book) {
        return res.send('no book exists')
      }

      await Book.updateOne({ _id }, { $push: { comments: comment } })

      book = await Book.findOne({ _id })

      return res.send(book)
    })

    .delete(async function (req, res) {
      let bookid = req.params.id;

      const _id = new ObjectId(bookid);

      let book = await Book.findOne({ _id });

      if (!book) {
        return res.send('no book exists')
      }

      const result = await Book.remove({ _id })

      return res.send('delete successful')
    });

};
