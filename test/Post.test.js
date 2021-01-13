const chai = require('chai');

const expect = chai.expect;
const url = `http://localhost:3000`;
const request = require('supertest')(url);

let postID = undefined;

describe('Create Post', () => {
    it('Adds a post', (done) => {
        request.post('/graphql')
        .send({ query: 'mutation { createPost(postInput: { title: "testPost", body: "testBodyPost" }) { id user { id, email } title body } }'})
        .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyNCwiaWF0IjoxNjEwNTM2MTY4fQ.Gaosl4oyRlcwZ5aT6PpqpRawds02D2sSLQx6y_LkFB0')
        .expect(200)
        .end((err,res) => {
            if (err) return done(err);
            expect(res.body.data.createPost).is.not.null;
            expect(res.body.data.createPost.id).is.not.null;
            postID = res.body.data.createPost.id;
            expect(res.body.data.createPost.title).equals("testPost");
            expect(res.body.data.createPost.body).equals("testBodyPost");
            done();
        })
    })
});

describe('Post', () => {
    it('Returns post with id = 2', (done) => {
        request.post('/graphql')
        .send({ query: '{ post(postId: 2) { id user { id, email} title body } }'})
        .expect(200)
        .end((err,res) => {
            if (err) return done(err);
            expect(res.body.data.post).is.not.null;
            expect(res.body.data.post[0]).is.not.null;
            expect(res.body.data.post[0].id).equals(2);    
            expect(res.body.data.post[0].user.id).equals(3);  
            expect(res.body.data.post[0].user.email).equals("Alejandra.Braun60@gmail.com");        
            expect(res.body.data.post[0].title).equals("another post");            
            expect(res.body.data.post[0].body).equals("this is another post");
            done();
        })
    })
});


describe('Post', () => {
    it('Returns posts for the user with id = 3' , (done) => {
        request.post('/graphql')
        .send({ query: '{ post(userId: 3) { id user {id email} title body } }'})
        .expect(200)
        .end((err,res) => {
            if (err) return done(err);
            expect(res.body.data.post).is.not.null;
            res.body.data.post.forEach(post => {
                expect(post).is.not.null;
                expect(post.id).is.not.null;    
                expect(post.postId).is.not.null;          
                expect(post.user.id).is.not.null;   
                expect(post.user.email).is.not.null;           
                expect(post.body).is.not.null;
            });
            done();
        })
    })
});


describe('Delete Post', () => {
    it('Delete a post', (done) => {
        request.post('/graphql')
        .send({ query: 'mutation { deletePost(postId:' + postID + ') }'})
        .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyNCwiaWF0IjoxNjEwNTM2MTY4fQ.Gaosl4oyRlcwZ5aT6PpqpRawds02D2sSLQx6y_LkFB0')
        .expect(200)
        .end((err,res) => {
            if (err) return done(err);
            expect(res.body.data.deletePost).is.not.null;
            expect(res.body.data.deletePost).equals("Post was deleted!");
            done();
        })
    })
});