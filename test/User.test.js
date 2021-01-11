const chai = require('chai');

const expect = chai.expect;
const url = `http://localhost:3000`;
const request = require('supertest')(url);

describe('Users', () => {
    it('Returns user with id = 20', (done) => {
        request.post('/graphql')
        .send({ query: '{ user(userId: 20) { id email } }'})
        .expect(200)
        .end((err,res) => {
            if (err) return done(err);
            expect(res.body.data.user).is.not.null;
            expect(res.body.data.user.id).equals(20);
            done();
        })
    })
});