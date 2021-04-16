const express = require('express');
const cors = require('cors');

const app = express();

app.use('/', express.static('../client/src/'));
app.use(cors());

app.get('/', (req, res) => {
    res.redirect('http://localhost:8081');
})

app.get('/auth/login/auth0', (req, res) => {
    console.log('server login');
    res.send('successfully logged in');
})

app.get('/auth/logout', (req, res) => {
    console.log('server logout');
    res.send('successfully logged out');
})



const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log('App listening on port ' + 8080)
});


