const express = require('express');
const { startRegistration, finishRegistration, listRegistration, startAuthentication, finishAuthentication } = require('./verify');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

app.post('/register/start', startRegistration);
app.post('/register/finish', finishRegistration);
app.get('/register/list', listRegistration);
// app.post('/auth/start', startAuthentication);
// app.post('/auth/finish', finishAuthentication);

app.listen(port, () => console.log(`Server listening on port ${port}`));
