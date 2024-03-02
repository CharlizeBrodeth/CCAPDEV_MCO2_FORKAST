const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = 3000;

let users = [];

app.engine('hbs', exphbs.engine({
    extname: 'hbs',
    defaultLayout: 'main',
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));


// Routes
app.get('/', (req, res) => res.render('home'));
app.get('/login', (req, res) => res.render('login'));
app.get('/register', (req, res) => res.render('register'));
app.get('/search', (req, res) => res.render('search'));

// Process - Login Form
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(user => user.email === email);

    if (user && user.password === password) {
        console.log(`User logged in: ${email}`);
        res.redirect('/');
    } else {
        res.render('login', {
            message: 'Invalid email or password',
            messageType: 'error'
        });
    }
});

// Process - Registration Form
app.post('/register', (req, res) => {
    const { familyName, firstName, username, screenName, birthDate, email, password } = req.body;

    if (users.some(user => user.email === email)) {
        res.render('register', {
            message: 'User already exists with the given email',
            messageType: 'error'
        });
    } else {
        users.push({ familyName, firstName, username, screenName, birthDate, email, password });
        console.log(`New user registered: ${email}`);
        res.redirect('/login');
    }
});

// Process - Search Form // NEEDS search-results.hbs
app.post('/search', (req, res) => {
    const { query, filterType } = req.body;
    let results = []; 

    if (filterType === 'restaurant') {
        console.log('Searching in restaurants:', query);
        res.render('search-results', { results: results, searchType: 'Restaurants' });
    } else if (filterType === 'review') {
        console.log('Searching in reviews:', query);
        res.render('search-results', { results: results, searchType: 'Reviews' });
    } else {
        res.render('search', { errorMessage: 'Invalid filter type selected.' });
    }
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}. Visit http://localhost:${PORT}`));
