const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/')
const user_details = new mongoose.Schema({
    familyName: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    screenName: {
        type: String,
        required: true
    },
    birthDate: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
},{versionKey:false});


const comment_list = new mongoose.Schema({
    comment_text:{type: String}
},{versionKey:false});

const review_list = new mongoose.Schema({
    review_text: {type: String}
},{versionKey:false});

const restaurant_details = new mongoose.Schema({
    resto_name:{
        type:String
    },
    resto_pic:{
        type:String
    }
},{versionKey:false});


const userModel = mongoose.model('User', user_details);
const restoModel = mongoose.model('User', restaurant_details);
const reviewModel = mongoose.model('User', review_list);
const commentModel = mongoose.model('User', comment_list);
module.exports = User;




