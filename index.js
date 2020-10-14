const express = require('express');
const app = express();
const port = 3000;
const generateMessage = require('./app/generateMessage');

app.get('/random-message', (req, res) => {
    generateMessage()
        .then((body) => {
            const { text } = body;
            res.send(text);
        })
        
});

app.listen(port, () => {
    console.log("App is listening on port " + port + ' !');
});