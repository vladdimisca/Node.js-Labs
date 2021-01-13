const chai = require('chai');

const expect = chai.expect;
const url = `http://localhost:3000`;
const request = require('supertest')(url);

let token = undefined;

describe('Register', () => {
    it('Adds a user', (done) => {
        request.post('/graphql')
        .send({ query: 'mutation { register(email: "test@gmail.com", password: "12345", profileInput: { firstName: "Test", lastName: "MyTest"}) { id email profile {firstName lastName} } }'})
        .expect(200)
        .end((err,res) => {
            if (err) return done(err);
            expect(res.body.data.register).is.not.null;
            expect(res.body.data.register.id).is.not.null;
            expect(res.body.data.register.email).equals("test@gmail.com");
            expect(res.body.data.register.profile.firstName).equals("Test");
            expect(res.body.data.register.profile.lastName).equals("MyTest");
            done();
        })
    })
});

describe('Login', () => {
    it('User login', (done) => {
        request.post('/graphql')
        .send({ query: 'mutation { login(email: "test@gmail.com", password: "12345") }'})
        .expect(200)
        .end((err,res) => {
            if (err) return done(err);
            expect(res.body.data.login).is.not.null;
            token = res.body.data.login;
            done();
        })
    })
});

describe('Users', () => {
    it('Returns user with id = 1', (done) => {
        request.post('/graphql')
        .send({ query: '{ user(userId: 1) { id email } }'})
        .expect(200)
        .end((err,res) => {
            if (err) return done(err);
            expect(res.body.data.user).is.not.null;
            expect(res.body.data.user.id).equals(1);
            expect(res.body.data.user.email).equals("Myriam_Jacobi87@gmail.com");
            done();
        })
    })
});

describe('Delete user', () => {
    it('Delete user', (done) => {
        request.post('/graphql')
        .send({ query: 'mutation { deleteUser }'})
        .set('authorization', 'Bearer ' + token)
        .expect(200)
        .end((err,res) => {
            if (err) return done(err);
            expect(res.body.data.deleteUser).is.not.null;
            expect(res.body.data.deleteUser).equals("User was deleted!");
            done();
        })
    })
});