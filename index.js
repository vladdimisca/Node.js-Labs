const express = require('express');
const app = express();
const port = 3000;

// graphQL
const { graphqlHTTP } = require('express-graphql');
const schema = require('./graphql');

// middlewares
const authenticationMiddleware = require('./middleware/authenticationMiddleware');

app.use('/graphql', graphqlHTTP({
    schema
}));

app.listen(port, () => {
    console.log("App is listening on port " + port + ' !');
});
