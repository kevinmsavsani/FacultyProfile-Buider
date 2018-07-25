var express = require('express');
var nl2br = require('nl2br');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var Recaptcha = require('express-recaptcha');
var recaptcha = new Recaptcha('6LcgQzsUAAAAAP6CkTwccw1EkWMCRClb66lku9VE', '6LcgQzsUAAAAAEshsYMCi5KmNtHJZ99Bz0oIPwPW');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const config =require('./config/database');
const passport = require('passport');

var app = express();

mongoose.connect(config.database);
var db = mongoose.connection;

db.once('open',function(){
    console.log("connected database");
});

db.on('error',function(err){
    console.log(err);
});


var Research = require('./models/research');
var Teaching = require('./models/teaching');
var Publication = require('./models/publication');
// user model
var User = require('./models/user');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('app/public'));
app.set('views','app/views');
app.set('view engine','ejs');




// Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));

// passport config

require('./config/passport')(passport);

// middleware
app.use(passport.initialize());
 app.use(passport.session());

// For Logout

app.get('*', function(req, res, next){

   res.locals.user = req.user || null;
   next();
});



// take data from inpute file

app.get('/', function(req, res){

    User.find({}, function(err, user){
        if(err){
            console.log("err");
        }
        else{
            res.render('Home',{
                title : "Home",
                users: user
            });
        }
    });
});

// This will handle 404 requests.

// each research page with login

app.get('/researchs', function(req, res){


    Research.find({}, function(err, research){
        if(err){
            console.log(err);
        }
        else{
            res.render('contentwithoutlogin',{
                title : "Researches",
                content: research,
                //users: user

            });
        }
    });
});

app.get('/teachings', function(req, res){


    Teaching.find({}, function(err, teaching){
        if(err){
            console.log(err);
        }
        else{
            res.render('contentwithoutlogin',{
                title : "Teaching",
                content: teaching
            });
        }
    });
});


app.get('/publications', function(req, res){


    Publication.find({}, function(err, publication){
        if(err){
            console.log(err);
        }
        else{
            res.render('contentwithoutlogin',{
                title : "Publication",
                content: publication
            });
        }
    });
});

//  prof page  with login

app.get('/prof', function(req, res){
            res.render('profpage');
});

// Router Files
var researchs = require('./routers/research');
app.use('/research',researchs);

var publications = require('./routers/publication');
app.use('/publication',publications);

var teachings = require('./routers/teaching');
app.use('/teaching',teachings);

var name = require('./routers/project');
app.use('/name',name);

var users = require('./routers/users');
app.use('/users',users);

var departments = require('./routers/departments');
app.use('/departments',departments);





// server

app.listen(2000,function(){
    console.log("server conneccted 2000");
});
