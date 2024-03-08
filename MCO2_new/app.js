//Forkast server side 

//Set-up//
const express = require('express'); // will let us use the module express 
const server = express(); 

const bodyParser = require('body-parser');
server.use(express.json());
server.use(express.urlencoded({extended: true}));

const handlebars = require('express-handlebars');
server.set('view engine', 'hbs');
server.engine('hbs', handlebars.engine({
    extname: 'hbs'
}));

server.use(express.static('public'));
//End of set-up//

//Add resto data module//
const resto_data = require('./resto_data');

//set const to the data
const resto_info = resto_data.restaurant_details;


//Render Home page (start)//
server.get('/', function(req, resp){
    //render the home.html
    resp.render('start', {
        layout: 'index',
        title: 'Welcome to Forkast'
    });
});

//Render Login page//
server.get('/login/', function(req, resp){
    //render the login.html
    resp.render('login',{
        layout: 'index',
        title: 'Login Page'
    });
});

//Render Register page//
server.get('/register/', function(req, resp){
    //render the register.html
    resp.render('register',{
        layout: 'index',
        title: 'Register Page'
    });
});

//Render Search page//
server.get('/home/', function(req, resp){
    //render the search-page.html
    resp.render('home',{
        layout: 'index-home',
        title: 'Forkast Home Page',
        resto_info: resto_info
    });
});

//Render Search Page//
server.get('/search/', function(req, resp){
    //render the search-page.html
    resp.render('search',{
        layout: 'index-search',
        title: 'Search Page'
    });
});



//Port//
const port = process.env.port || 9090;
server.listen(port, function(){
    console.log('listening at port' +port);
});