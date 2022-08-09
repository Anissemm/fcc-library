/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  // test('#example Test GET /api/books', function (done) {
  //   chai.request(server)
  //     .get('/api/books')
  //     .end(function (err, res) {
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       done();
  //     });
  // });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function () {
    let _id = null;

    suite('POST /api/books with title => create book object/expect book object', function () {

      test('Test POST /api/books with title', function (done) {
        chai.request(server)
          .post('/api/books')
          .send({ title: 'test book title' })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.property(res.body, 'comments', 'Book should contain comments property');
            assert.isArray(res.body.comments, 'comments property should be an array');
            assert.property(res.body, 'title', 'Book should contain title');
            assert.property(res.body, '_id', 'Book should contain _id');
            _id = res.body._id;
            done();
          });
      });

      test('Test POST /api/books with no title given', function (done) {
        chai.request(server)
          .post('/api/books')
          .send({ title: '' })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isString(res.text, 'missing required field title');
            done();
          });
      });

    });


    suite('GET /api/books => array of books', function () {

      test('Test GET /api/books', function (done) {
        chai.request(server)
          .get('/api/books')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
          });
      });

    });


    suite('GET /api/books/[id] => book object with [id]', function () {

      test('Test GET /api/books/[id] with id not in db', function (done) {
        chai.request(server)
          .get(`/api/books/62f26d021fa28ecd65c106d8`)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isString(res.text, 'Response type should be a string');
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

      test('Test GET /api/books/[id] with id', function (done) {
        chai.request(server)
          .get(`/api/books/${_id}`)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'Response type should be an object');
            assert.property(res.body, 'comments', 'Book should contain comments property');
            assert.isArray(res.body.comments, 'comments property should be an array');
            assert.property(res.body, 'title', 'Book should contain title');
            assert.property(res.body, '_id', 'Book should contain _id');
            done();
          });
      });
    });

    suite('POST /api/books/[id] => add comment/expect book object with id', function () {

      test('Test POST /api/books/[id] with comment', function (done) {
        chai.request(server)
          .post(`/api/books/${_id}`)
          .send({ comment: 'This is a comment' })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'Response type should be an object');
            assert.property(res.body, 'comments', 'Book should contain comments property');
            assert.isArray(res.body.comments, 'comments property should be an array');
            assert.oneOf(res.body.comments[0], ['This is a comment']);
            assert.property(res.body, 'title', 'Book should contain title');
            assert.property(res.body, '_id', 'Book should contain _id');
            done();
          });
      });


      test('Test POST /api/books/[id] without comment field', function (done) {
        chai.request(server)
          .post(`/api/books/${_id}`)
          .send({ comment: '' })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isString(res.text, 'response should be of type string');
            assert.equal(res.text, 'missing required field comment');
            done();
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function (done) {
        chai.request(server)
          .post(`/api/books/62f26d021fa28ecd65c106d8`)
          .send({ comment: 'this is a comment' })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isString(res.text, 'response should be of type string');
            assert.equal(res.text, 'no book exists');
            done();
          });
      });
    });

    suite('DELETE /api/books/[id] => delete book object id', function () {

      test('Test DELETE /api/books/[id] with valid id in db', function (done) {
        chai.request(server)
          .delete(`/api/books/${_id}`)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isString(res.text, 'response should be of type string');
            assert.equal(res.text, 'delete successful');
            done();
          });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function (done) {
        chai.request(server)
        .delete(`/api/books/62f26d021fa28ecd65c106d8`)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isString(res.text, 'response should be of type string');
          assert.equal(res.text, 'no book exists');
          done();
        });
      });

    });

  });

});
