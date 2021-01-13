const chai = require('chai');

const expect = chai.expect;
const url = `http://localhost:3000`;
const request = require('supertest')(url);

let commentID = undefined;

describe('Create Comment', () => {
    it('Adds a comment', (done) => {
        request.post('/graphql')
        .send({ query: 'mutation { createComment( postId: 25, body: "testBodyComment" ) { id userId postId body } }'})
        .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyNCwiaWF0IjoxNjEwNTM2MTY4fQ.Gaosl4oyRlcwZ5aT6PpqpRawds02D2sSLQx6y_LkFB0')
        .expect(200)
        .end((err,res) => {
            if (err) return done(err);
            expect(res.body.data.createComment).is.not.null;
            expect(res.body.data.createComment.id).is.not.null;
            commentID = res.body.data.createComment.id;
            expect(res.body.data.createComment.body).equals("testBodyComment");
            done();
        })
    })
});

describe('Comment', () => {
    it('Returns comment with id = 1', (done) => {
        request.post('/graphql')
        .send({ query: '{ comment(commentId: 1) { id postId userId body } }'})
        .expect(200)
        .end((err,res) => {
            if (err) return done(err);
            expect(res.body.data.comment).is.not.null;
            expect(res.body.data.comment[0]).is.not.null;
            expect(res.body.data.comment[0].id).equals(1);    
            expect(res.body.data.comment[0].postId).equals(1);          
            expect(res.body.data.comment[0].userId).equals(1);            
            expect(res.body.data.comment[0].body).equals("renucjn");
            done();
        })
    })
});


describe('Comment', () => {
    it('Returns comments for the post with id = 1' , (done) => {
        request.post('/graphql')
        .send({ query: '{ comment(postId: 1) { id postId userId body } }'})
        .expect(200)
        .end((err,res) => {
            if (err) return done(err);
            expect(res.body.data.comment).is.not.null;
            res.body.data.comment.forEach(comm => {
                expect(comm).is.not.null;
                expect(comm.id).is.not.null;    
                expect(comm.postId).is.not.null;          
                expect(comm.userId).is.not.null;            
                expect(comm.body).is.not.null;
            });
            done();
        })
    })
});

describe('Delete comment', () => {
    it('Delete a comment', (done) => {
        request.post('/graphql')
        .send({ query: 'mutation { deleteComment( commentId:' + commentID + ' ) }'})
        .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyNCwiaWF0IjoxNjEwNTM2MTY4fQ.Gaosl4oyRlcwZ5aT6PpqpRawds02D2sSLQx6y_LkFB0')
        .expect(200)
        .end((err,res) => {
            if (err) return done(err);
            expect(res.body.data.deleteComment).is.not.null;
            expect(res.body.data.deleteComment).equals("Comment was deleted!");
            done();
        })
    })
});
