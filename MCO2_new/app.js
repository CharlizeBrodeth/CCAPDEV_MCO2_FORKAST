//Forkast server side 
//Install Command:
//npm init
//npm i express express-handlebars body-parser mongoose

//Set-up//
const express = require('express');  
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

//Connect to DB//
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/Forkastdb');

//create collection under Forkastdb//
const userSchema = new mongoose.Schema({
    fam_name: { type: String },
    first_name: { type: String },
    user_name: { type: String },
    screen_name: { type: String },
    bday: {type: Date},
    email: {type: String},
    password: {type: String}
  },{ versionKey: false });


//create model for collection//
const userModel = mongoose.model('user', userSchema);

//create collection for restaurants//
const restoSchema = new mongoose.Schema({
    resto_name: {type: String},
    resto_image: {type:String},
},{versionKey: false});

//model for resto collection//
const restoModel = new mongoose.model('restaurant', restoSchema);


const resto_reviewSchema = new mongoose.Schema({
    user_name: {type: String},
    resto_name: {type: String},
    review_title: {type: String},
    review_desc: {type: String},
    rating: {type: Number}
},{versionKey: false});


const resto_reviewModel = new mongoose.model('resto_reviews', resto_reviewSchema);

//creating reviews//delete later.......................

//reating review end// 
function errorFn(err){
    console.log('Error fond. Please trace!');
    console.error(err);
}

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

//Accepting login//
server.post('/check_login', function(req, resp){
    //get inputs//
    const searchQuery= {email: req.body.email, password: req.body.password};
    //find in model//
    userModel.findOne(searchQuery).then(function(user){
        console.log('checking if registered user');
        if(user != undefined && user._id != null){
            //loading home once user logins//
            
            //get all values in restoModel
            restoModel.find({}).then(function(restaurant){
                console.log('Retrieving all documents from restoModel');
                let restoArray = [];

                for(const item of restaurant){
                    restoArray.push({
                        _id: item._id.toString(),
                        resto_name: item.resto_name,
                        resto_image: item.resto_image
                    });
                }

                resp.render('home',{
                    layout: 'index-home',
                    title: 'Forkast Home Page',
                    resto_info: restoArray,
                    screen_name: user.screen_name
                });
            }).catch(errorFn);
        }
        else{
            resp.render('result',{
                layout: 'index',
                title: 'Result of Action',
                msg: 'Sorry! wrong Email or Password, please try again',
                btn_msg: 'Go back to Login',
                move_to: 'login'
            });
        }
    }).catch(errorFn);
});


//Render Register page//
server.get('/register/', function(req, resp){
    //render the register.html
    resp.render('register',{
        layout: 'index',
        title: 'Register Page'
    });
});

//Adding a user to the DB//
server.post('/create_user', function(req,resp){
    //create instance of usermodel//
    const userInstance = userModel({
        fam_name: req.body.fam_name,
        first_name: req.body.first_name,
        user_name: req.body.user_name,
        screen_name: req.body.screen_name,
        bday: req.body.bday,
        email: req.body.email,
        password: req.body.password
    });

    //save instance to DB//
    userInstance.save().then(function(user){
        console.log('Successfully created user');
        //render page to show the result if the user was created sucessfully//
        resp.render('result',{
            layout: 'index',
            title: 'Result of Action',
            msg: 'Sucessfully Registered! Please Proceed to Login',
            btn_msg: 'Proceed to Login',
            move_to: 'login'
        });
    }).catch(errorFn);
});

//Render Home page//
server.get('/home/', function(req, resp){
    restoModel.find({}).then(function(restaurant){
        console.log('Retrieving all documents from restoModel');
        let restoArray = [];

        for(const item of restaurant){
            restoArray.push({
                _id: item._id.toString(),
                resto_name: item.resto_name,
                resto_image: item.resto_image
            });
        }

        resp.render('home',{
            layout: 'index-home',
            title: 'Forkast Home Page',
            resto_info: restoArray
        });
    }).catch(errorFn);
    //render the search-page.html
});

//Render Search Page//
server.get('/search/', function(req, resp){
    //render the search-page.html
    resp.render('search',{
        layout: 'index-search',
        title: 'Search Page'
    });
});

//Render See Reviews of Restaurants//
server.get('/review_page/:name/', function(req, resp){
    const restoName = req.params.name;
    console.log(restoName);
    //find all reviews for the given resturant name
    const searchResto = {resto_name: restoName};

    //get image of restuarant
    restoModel.findOne(searchResto).then(function(restaurant){
        const restoImage = restaurant.resto_image;

        //get all reviews of that restaurant
        resto_reviewModel.find(searchResto).then(function(resto_reviews){
            console.log('Retrieving all reviews of the restaurant');
            let reviews = [];
            for(const item of resto_reviews){
                reviews.push({
                    user_name: item.user_name,
                    resto_name: item.resto_name,
                    review_title: item.review_title,
                    review_desc: item.review_desc,
                    rating: item.rating
                });
            }
            resp.render('reviews',{
                layout: 'index-reviews',
                title: 'Review Page'+ restoName,
                reviews_list: reviews,
                resto_image: restoImage,
                restoName : restoName
            });
        }).catch(errorFn);
    }).catch(errorFn);
});


//Close DB//
function finalClose(){
    console.log('Close connection at the end!');
    mongoose.connection.close();
    process.exit();
}

process.on('SIGTERM',finalClose);  //general termination signal
process.on('SIGINT',finalClose);   //catches when ctrl + c is used
process.on('SIGQUIT', finalClose); //catches other termination commands


//Port//
const port = process.env.port || 3000;
server.listen(port, function(){
    console.log('listening at port' +port);
});