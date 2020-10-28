const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser'); 
const jwt = require('jsonwebtoken');
const generateMessage = require('./app/generateMessage');
const config = {
    secretKey: 'SuperSecretKey'
}

app.use(bodyParser.json());

app.get('/random-message', (req, res) => {
    generateMessage()
        .then((body) => {
            const { text } = body;
            res.send(text);
        })
        
});

const authorizationMiddleware = (req, res, next) => {
    const { authorization } = req.headers;
    
    if(!authorization) {
        res.status(401).send({
            status: 'not ok'
        }) 
    }

    const jwtToken = authorization.replace('Bearer ', '');
    

    jwt.verify(jwtToken, config.secretKey, (err, decoded) => {
        if(err) {
            res.status(401).send({
                status: 'not ok'
            })
        } else {
            next()
        }
    })
}

app.post('/graphql', authorizationMiddleware, (req, res) => {
    res.status(200).send({
        status: 'ok'
    });
});

app.post('/graphql/public', (req, res) => {
    const { user, pass } = req.body;

    if(user === "Gogu" && pass === "P@rOLA") {
        jwt.sign({}, config.secretKey, (err, token) => {
            res.send({
                token
            });
        });
    } else {
        res.status(401).send({
            status: 'not ok'
        })
    }
});

app.listen(port, () => {
    console.log("App is listening on port " + port + ' !');
});