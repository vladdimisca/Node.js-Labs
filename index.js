const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser'); 
const jwt = require('jsonwebtoken');
const generateMessage = require('./app/generateMessage');
const config = {
    secretKey: 'SuperSecretKey'
}
const models = require('./models');

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

app.get('/users/:userId', async (req, res) => {
    const userId = req.params.userId;

    const user = await models.User.findByPk(userId); 

    res.send({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
    })
})

app.post('/users/:userId/add/profile', async (req, res) => {
    const userId = req.params.userId;
    const photoURL = req.body.photoURL;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const user = await models.User.findByPk(userId);

    const profile = await user.createProfile({
        userId: userId, 
        photoURL: photoURL,
        firstName: firstName,
        lastName: lastName
    });

    res.send({
        profile
    })
});

app.get('/users/:userId/profile', async (req, res) => {
    const userId = req.params.userId;
    const user = await models.User.findByPk(userId);
    const profile = await user.getProfile();
  
    res.send({
      email: user.email,
      profile,
    });
});

app.post('/users/:userId/post', async (req, res) => {
    const userId = req.params.userId;
    const title = req.body.title;
    const body = req.body.body;
    const user = await models.User.findByPk(userId);

    await user.createPost({
      title: title,
      body: body,
    });
    
    res.send({
      status: 'ok',
    });
  });

app.listen(port, () => {
    console.log("App is listening on port " + port + ' !');
});